import { PrismaClient } from "@prisma/client";

export async function generateRefNumber(module: string, prisma: PrismaClient): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  const currentYearStart = new Date(year, 0, 1);
  const nextYearStart = new Date(year + 1, 0, 1);
  
  const currentMonthStart = new Date(year, now.getMonth(), 1);
  const nextMonthStart = new Date(year, now.getMonth() + 1, 1);

  let count = 0;
  let ref = '';

  switch (module) {
    case 'CH':
      count = await prisma.chalet.count();
      ref = `CH-${String(count + 1).padStart(3, '0')}`;
      break;

    case 'CLT':
      count = await prisma.client.count();
      ref = `CLT-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'RES':
      count = await prisma.reservation.count({
        where: {
          createdAt: {
            gte: currentYearStart,
            lt: nextYearStart,
          }
        }
      });
      ref = `RES-${year}-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'RCP':
      count = await prisma.payment.count({
        where: {
          date: {
            gte: currentYearStart,
            lt: nextYearStart,
          }
        }
      });
      ref = `RCP-${year}-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'REV':
      count = await prisma.revenue.count({
        where: {
          revenue_date: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          }
        }
      });
      ref = `REV-${year}-${month}-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'EXP':
      count = await prisma.expense.count({
        where: {
          date: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          }
        }
      });
      ref = `EXP-${year}-${month}-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'MNT':
      count = await prisma.maintenance.count({
        where: {
          date: {
            gte: currentYearStart,
            lt: nextYearStart,
          }
        }
      });
      ref = `MNT-${year}-${String(count + 1).padStart(5, '0')}`;
      break;

    case 'USR':
      count = await prisma.user.count();
      ref = `USR-${String(count + 1).padStart(3, '0')}`;
      break;

    default:
      throw new Error(`Unknown module: ${module}`);
  }

  return ref;
}
