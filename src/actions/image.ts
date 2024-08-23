"use server";
import { checkUserInDatabase } from "@/actions/user";
import { prisma } from "@/lib/prisma";

export async function saveImageToDatabase(imageUrl: string) {
  try {
    const prismaUser = await checkUserInDatabase();

    if (!prismaUser || !prismaUser.id) {
      console.log("unauthorised user");
      return "unauthorised user";
    }

    const image = await prisma.image.create({
      data: {
        base64: imageUrl,
        userId: prismaUser.id,
      },
    });

    return image.id;
  } catch (error) {
    console.error("Error saving image to database:", error);
  }
}
