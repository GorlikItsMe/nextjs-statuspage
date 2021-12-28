import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const categoryList = await prisma.category.findMany();
  res.status(200).json(categoryList);
};
