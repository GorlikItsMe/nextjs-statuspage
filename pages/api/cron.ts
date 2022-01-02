import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { CheckMethodType, Service, StatusLog, Event } from "@prisma/client";
import axios from "axios";

interface CheckReport {
  service: RichService;
  status: boolean;
}

export type RichService = Service & {
  StatusLog: StatusLog[];
  Event: Event[];
};

async function CheckHttp(service: RichService): Promise<CheckReport> {
  try {
    let response = await axios({
      method: "GET",
      url: service.url,
      timeout: 2000,
    });
    console.log(service.url, response.status);
    return {
      service,
      status: true,
    };
  } catch (err) {
    console.log(service.url, err.response?.status);
    return {
      service,
      status: false,
    };
  }
}

function CalculateGlobalStatus(servicesStatusList: Boolean[]): number {
  // 0-all bad, 1-something bad 2-all ok
  const total = servicesStatusList.length;
  const onlineCount = servicesStatusList.filter((s) => s == true).length;
  const offlineCount = servicesStatusList.filter((s) => s == false).length;

  if (total == onlineCount) {
    return 2; // all okej
  }
  if (total == offlineCount) {
    return 0; // all bad
  }
  return 1; // some ok some bad
}

async function ProcessCheckReport(cr: CheckReport): Promise<CheckReport> {
  // dbPromiseList.push(updateServiceUptime(result.service.id, result.status));
  const service = cr.service;
  const newStatus = cr.status;
  let lastevent = service.Event[0];
  let nowdt = new Date();

  if (lastevent == undefined) {
    // no event, create it!
    const newevent = await prisma.event.create({
      data: {
        serviceId: service.id,
        isOnline: newStatus,
        dtStart: nowdt,
        dtEnd: nowdt,
      },
    });
    lastevent = newevent;
  }

  // zapisz status_log
  prisma.statusLog
    .create({
      data: {
        serviceId: service.id,
        isOnline: newStatus,
        dt: nowdt,
        ms: 0, // todo ping
      },
    })
    .then((obj) => console.log("statusLog created"))
    .catch((err) => console.error(err));

  // czy usługa była wcześniej w takim samym stanie
  const isTheSameAsLastTime = cr.service.StatusLog[0].isOnline == cr.status;

  if (isTheSameAsLastTime) {
    console.log("isTheSameAsLastTime");
    // taki sam stan usługi nic się nie zmieniło
    // zaktualizuj ostatni EVENT (ustaw dt na Now())
    prisma.event
      .update({
        where: { id: lastevent.id },
        data: { dtEnd: nowdt },
      })
      .then((obj) => console.log("Last event update"))
      .catch((err) => console.error("last event update fail", err));
  } else {
    // nowy stan usługi
    if (cr.status) {
      // jest teraz online
      // dodaj nowy EVENT że usługa wróciła
      prisma.event
        .create({
          data: {
            serviceId: service.id,
            isOnline: newStatus,
            dtStart: lastevent.dtEnd,
            dtEnd: nowdt,
            msg: "Service come back online",
          },
        })
        .then((obj) => console.log("new state! (is online)", obj))
        .catch((err) => console.error("error state update (is online)", err));
      // wyślij alerty że wróciło do normy
    } else {
      // jest teraz offline
      // dodaj nowy EVENT że usługa sie wywaliła
      prisma.event
        .create({
          data: {
            serviceId: service.id,
            isOnline: newStatus,
            dtStart: lastevent.dtEnd,
            dtEnd: nowdt,
            msg: "Service have problems",
          },
        })
        .then((obj) => console.log("new state! (is offline)", obj))
        .catch((err) => console.error("error state update (is online)", err));
      // wyślij alerty o problemie
    }
  }
  return cr;
}

export default async function CronAPI(_: NextApiRequest, res: NextApiResponse) {
  // Get services
  const serviceList = await prisma.service.findMany({
    include: {
      StatusLog: {
        take: 1,
        orderBy: {
          dt: "desc",
        },
      },
      Event: {
        take: 1,
        orderBy: {
          id: "desc",
        },
      },
    },
  });

  let promiseList = [];

  // check all services status
  serviceList.forEach((s) => {
    if (s.check_method == CheckMethodType.HTTP) {
      promiseList.push(CheckHttp(s));
    }
  });

  // update all services status
  let dbPromiseList: Promise<CheckReport>[] = [];
  await Promise.all(promiseList).then((results) => {
    results.forEach((result: CheckReport) => {
      dbPromiseList.push(ProcessCheckReport(result));
    });
  });

  // create nice formated output
  let resultJson = {
    globalStatus: 0, // 0-all bad, 1-something bad 2-all ok
    services: [],
  };
  await Promise.all(dbPromiseList).then((crList: CheckReport[]) => {
    let servicesStatusList: Boolean[] = [];
    crList.forEach((cr) => {
      servicesStatusList.push(cr.status);
    });
    resultJson.globalStatus = CalculateGlobalStatus(servicesStatusList);
    crList.forEach((cr) => {
      resultJson.services.push({
        id: cr.service.id,
        name: cr.service.name,
        isOnline: cr.status,
      });
    });
  });

  res.status(200).json(resultJson);
}
