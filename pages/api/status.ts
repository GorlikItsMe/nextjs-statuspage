import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function StatusAPI(
  _: NextApiRequest,
  res: NextApiResponse
) {
  let categoryList = await prisma.category.findMany({
    include: {
      Service: {
        include: {
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
        },
      },
    },
  });

  categoryList.forEach((c) => {
    c.Service.forEach((s) => {
      delete s.categoryId;
      delete s.url;
      delete s.check_method;
      delete s.createdAt;
      delete s.updatedAt;
    });
  });

  res.status(200).json(categoryList);
}
