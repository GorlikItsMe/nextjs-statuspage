import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { statusApiCacheTimeSec } from "../../lib/cacheConfig";

interface StatusApiOutputCategory {
  id: number;
  name: string;
  Service: {
    id: number;
    name: string;
    pos: number;
    isOnline: boolean;
    checkDt: Date;
    ms: number;
    msg: string;
    Event: {
      id: number;
      isOnline: boolean;
      dtStart: Date;
      dtEnd: Date;
      msg: string;
    }[];
  }[];
}
type StatusApiOutput = StatusApiOutputCategory[];

export default async function StatusAPI(
  _: NextApiRequest,
  res: NextApiResponse
) {
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

  let output: StatusApiOutput = [];

  categoryList.forEach((c) => {
    let tOut: StatusApiOutputCategory = {
      id: c.id,
      name: c.name,
      Service: [],
    };
    c.Service.forEach((s) => {
      tOut.Service.push({
        id: s.id,
        name: s.name,
        pos: s.pos,
        isOnline: s.StatusLog[0].isOnline,
        checkDt: s.StatusLog[0].dt,
        ms: s.StatusLog[0].ms,
        msg: s.StatusLog[0].msg,
        Event: s.Event,
      });
    });

    output.push(tOut);
  });

  res.setHeader("Cache-Control", `public, max-age=${statusApiCacheTimeSec}`);
  res.status(200).json(output);
}
