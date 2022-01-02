import prisma from "./prisma";
import { Category, Service } from "@prisma/client";

export type RichCategory = Category & {
  Service: Service[];
};

export async function getServicesData(): Promise<RichCategory[]> {
  const categoryList = await prisma.category.findMany({
    include: { Service: true },
  });

  return categoryList;
}

// export async function updateServiceUptime(
//   serviceId: number,
//   newStatus: boolean
// ): Promise<Service> {
//   return await prisma.service.update({
//     where: {
//       id: serviceId,
//     },
//     data: {
//       isOnline: newStatus,
//     },
//   });
// }
