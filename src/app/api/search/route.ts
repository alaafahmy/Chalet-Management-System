import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatRefID } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [clients, chalets, reservations] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            { nationalId: { contains: query } },
            { ref_number: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, name: true, phone: true, ref_number: true },
      }),
      prisma.chalet.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { ref_number: { contains: query, mode: 'insensitive' } }
          ],
        },
        take: 5,
        select: { id: true, name: true, type: true, ref_number: true },
      }),
      prisma.reservation.findMany({
        where: {
          OR: [
            { ref_number: { contains: query, mode: 'insensitive' } },
            {
              client: {
                OR: [
                  { name: { contains: query, mode: 'insensitive' } },
                  { phone: { contains: query } },
                ]
              }
            }
          ]
        },
        take: 5,
        include: { client: true, chalet: true },
      }),
    ]);

    const results: any[] = [];

    // Format clients
    clients.forEach(c => {
      results.push({
        id: c.id,
        type: 'عميل',
        title: c.name,
        subtitle: c.phone,
        link: `/dashboard/clients?search=${encodeURIComponent(c.name)}`,
        ref: c.ref_number
      });
    });

    // Format chalets
    chalets.forEach(c => {
      results.push({
        id: c.id,
        type: 'شاليه',
        title: c.name,
        subtitle: `نوع الشاليه: ${c.type}`,
        link: `/dashboard/chalets`,
        ref: c.ref_number
      });
    });

    // Format reservations
    reservations.forEach(r => {
      results.push({
        id: r.id,
        type: 'حجز',
        title: `حجز باسم: ${r.client.name}`,
        subtitle: `الشاليه: ${r.chalet.name}`,
        link: `/dashboard/reservations`,
        ref: r.ref_number
      });
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
