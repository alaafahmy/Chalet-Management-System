import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { date: 'desc' },
      take: 20
    });
    const unreadCount = await prisma.notification.count({ where: { read: false } });
    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (id) {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    } else {
      await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
