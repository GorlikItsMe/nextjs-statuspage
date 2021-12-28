import prisma from "../lib/prisma";

export async function getCategoryList() {
  return await prisma.category.findMany();
}

export async function getProductList() {
  return await prisma.product.findMany();
}
