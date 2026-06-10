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
          ],
        },
        take: 5,
        select: { id: true, name: true, phone: true },
      }),
      prisma.chalet.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: { id: true, name: true, type: true },
      }),
      prisma.reservation.findMany({
        where: {
          client: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query } },
            ]
          }
        },
        take: 5,
        include: { client: true, chalet: true },
      }),
    ]);

    const results = [];

    // Format clients
    clients.forEach(c => {
      results.push({
        id: c.id,
        type: 'عميل',
        title: c.name,
        subtitle: c.phone,
        link: `/dashboard/clients?search=${encodeURIComponent(c.name)}`,
        ref: formatRefID(c.id, 'CLI')
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
        ref: formatRefID(c.id, 'CHL') // Not really used in UI but good for format
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
        ref: formatRefID(r.id, 'RES')
      });
    });

    // If query matches a formatted reference ID exactly (e.g. RES-XXXX)
    if (query.toUpperCase().startsWith('RES-')) {
      const allRes = await prisma.reservation.findMany({ include: { client: true, chalet: true } });
      const target = allRes.find(r => formatRefID(r.id, 'RES') === query.toUpperCase());
      if (target && !reservations.some(r => r.id === target.id)) {
        results.unshift({
          id: target.id,
          type: 'حجز',
          title: `حجز باسم: ${target.client.name}`,
          subtitle: `الشاليه: ${target.chalet.name}`,
          link: `/dashboard/reservations`,
          ref: formatRefID(target.id, 'RES')
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
