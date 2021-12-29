import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { CheckMethodType, Service } from "@prisma/client";
import axios from "axios";
import { updateServiceUptime } from "../../lib/services";

interface CheckReport {
  service: Service;
  status: boolean;
}

async function CheckHttp(service: Service): Promise<CheckReport> {
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
    console.log(service.url, err.response.status);
    return {
      service,
      status: false,
    };
  }
}

function CalculateGlobalStatus(serviceList: Service[]): number {
  // 0-all bad, 1-something bad 2-all ok
  const total = serviceList.length;
  const onlineCount = serviceList.filter((s) => s.isOnline == true).length;
  const offlineCount = serviceList.filter((s) => s.isOnline == false).length;

  if (total == onlineCount) {
    return 2; // all okej
  }
  if (total == offlineCount) {
    return 0; // all bad
  }
  return 1; // some ok some bad
}

export default async function CronAPI(_: NextApiRequest, res: NextApiResponse) {
  const serviceList = await prisma.service.findMany();
  let promiseList = [];

  serviceList.forEach((s) => {
    if (s.check_method == CheckMethodType.HTTP) {
      promiseList.push(CheckHttp(s));
    }
  });

  let dbPromiseList = [];

  await Promise.all(promiseList).then((results) => {
    results.forEach((result: CheckReport) => {
      dbPromiseList.push(updateServiceUptime(result.service.id, result.status));
    });
  });

  let resultJson = {
    globalStatus: 0, // 0-all bad, 1-something bad 2-all ok
    services: [],
  };
  await Promise.all(dbPromiseList).then((services: Service[]) => {
    resultJson.globalStatus = CalculateGlobalStatus(services);
    services.forEach((s) => {
      resultJson.services.push({
        id: s.id,
        name: s.name,
        isOnline: s.isOnline,
        updatedAt: s.updatedAt,
      });
    });
  });

  res.status(200).json(resultJson);
}
