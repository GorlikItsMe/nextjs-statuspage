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
          StatusLog: {
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
          },
          Event: {
            take: 5,
            orderBy: { id: "desc" },
            select: {
              id: true,
              isOnline: true,
              dtStart: true,
              dtEnd: true,
              msg: true,
            },
          },
        },
      },
    },
  });

  // last update time
  let oldest_dt = new Date();
  categoryList.forEach((c) => {
    c.Service.forEach((s) => {
      if (s.StatusLog.length == 0) {
        return; // service dont have any checks
      }
      let thisServiceLastCheck = new Date(s.StatusLog[0].dt);
      if (oldest_dt > thisServiceLastCheck) {
        oldest_dt = thisServiceLastCheck;
      }
    });
  });

  categoryList.forEach((c) => {
    let tOut: StatusApiOutputCategory = {
      id: c.id,
      name: c.name,
      Service: [],
      updatedAt: oldest_dt,
    };
    c.Service.forEach((s) => {
      let upSince: Date | null = null;
      if (s.Event.length >= 1) {
        if (s.Event[0].isOnline) {
          upSince = s.Event[0].dtStart;
        }
      }

      if (s.StatusLog.length >= 1) {
        tOut.Service.push({
          id: s.id,
          name: s.name,
          pos: s.pos,
          isOnline: s.StatusLog[0].isOnline,
          checkDt: s.StatusLog[0].dt,
          ms: s.StatusLog[0].ms,
          msg: s.StatusLog[0].msg,
          upSince: upSince,
          Event: s.Event,
        });
      } else {
        tOut.Service.push({
          id: s.id,
          name: s.name,
          pos: s.pos,
          isOnline: false,
          checkDt: new Date(),
          ms: 0,
          msg: "Not checked yet",
          upSince: upSince,
          Event: s.Event,
        });
      }
    });

    output.push(tOut);
  });

  res.setHeader("Cache-Control", `public, max-age=${statusApiCacheTimeSec}`);
  res.status(200).json(output);
}
