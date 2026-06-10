"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addClient(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const nationalId = formData.get("nationalId") as string;
  const notes = formData.get("notes") as string;

  if (!name || !phone) return { error: "الاسم ورقم الجوال مطلوبان" };

  try {
    await prisma.client.create({
      data: {
        name,
        phone,
        nationalId: nationalId || null,
        notes: notes || null,
      },
    });
    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (e: any) {
    if (e.code === 'P2002') return { error: "رقم الجوال مسجل مسبقاً" };
    return { error: "حدث خطأ أثناء الإضافة" };
  }
}

export async function addChalet(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const pricePerNight = Number(formData.get("pricePerNight"));
  const description = formData.get("description") as string;

  if (!id || !name || !type || !pricePerNight) return { error: "جميع الحقول المطلوبة يجب تعبئتها" };

  try {
    await prisma.chalet.create({
      data: {
        id,
        name,
        type,
        pricePerNight,
        description: description || null,
        status: "متاح",
      },
    });
    revalidatePath("/dashboard/chalets");
    return { success: true };
  } catch (e: any) {
    if (e.code === 'P2002') return { error: "رقم الشاليه مستخدم مسبقاً" };
    return { error: "حدث خطأ أثناء الإضافة" };
  }
}
