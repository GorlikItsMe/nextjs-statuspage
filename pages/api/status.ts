import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { statusApiCacheTimeSec } from "../../lib/cacheConfig";

export interface StatusApiOutputService {
  id: number;
  name: string;
  pos: number;
  isOnline: boolean;
  checkDt: Date;
  ms: number;
  msg: string;
  upSince: Date | null;
  Event: {
    id: number;
    isOnline: boolean;
    dtStart: Date;
    dtEnd: Date;
    msg: string;
  }[];
}
export interface StatusApiOutputCategory {
  id: number;
  name: string;
  updatedAt: Date;
  Service: StatusApiOutputService[];
}
export type StatusApiOutput = StatusApiOutputCategory[];

export default async function StatusAPI(
  _: NextApiRequest,
  res: NextApiResponse
) {
  let output: StatusApiOutput = [];

  console.log("run");
  // fetch data
  let categoryList = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { Service: true },
      },
      Service: {
        orderBy: { pos: "desc" },
        select: {
          id: true,
          name: true,
          pos: true,
        },
      },
    },
  });
  // update output
  categoryList.forEach((c) => {
    output.push({
      id: c.id,
      name: c.name,
      updatedAt: new Date(), // dummy
      Service: c.Service.map((s) => {
        return {
          id: s.id,
          name: s.name,
          pos: s.pos,

          isOnline: false, // dummy
          checkDt: new Date(), // dummy
          ms: 0, // dummy
          msg: "", // dummy
          upSince: null, // dummy
          Event: [], // dummy
        };
      }),
    });
  });

  output = await Promise.all(
    output.map(async (c) => {
      c.Service = await Promise.all(
        c.Service.map(async (s) => {
          const thisStatusLog = await prisma.statusLog.findFirst({
            where: { serviceId: s.id },
            select: {
              isOnline: true,
              dt: true,
              ms: true,
              msg: true,
            },
            take: 1,
            orderBy: {
              dt: "desc",
            },
          });

          s.isOnline = thisStatusLog.isOnline;
          s.checkDt = thisStatusLog.dt;
          s.ms = thisStatusLog.ms;
          s.msg = thisStatusLog.msg;

          const thisLastEvents = await prisma.event.findMany({
            where: { serviceId: s.id },
            take: 5,
            orderBy: { id: "desc" },
            select: {
              id: true,
              isOnline: true,
              dtStart: true,
              dtEnd: true,
              msg: true,
            },
          });
          s.Event = thisLastEvents;

          if (thisLastEvents[0].isOnline) {
            s.upSince = thisLastEvents[0].dtStart;
          }

          return s;
        })
      );
      return c;
    })
  );

  let oldest_dt = new Date();
  output.forEach((c) => {
    c.Service.forEach((s) => {
      let thisServiceLastCheck = new Date(s.checkDt);
      if (oldest_dt > thisServiceLastCheck) {
        oldest_dt = thisServiceLastCheck;
      }
    });
  });
  output.forEach((c) => {
    c.updatedAt = oldest_dt;
  });

  console.log("fin");

  res.setHeader("Cache-Control", `public, max-age=${statusApiCacheTimeSec}`);
  res.status(200).json(output);
}
