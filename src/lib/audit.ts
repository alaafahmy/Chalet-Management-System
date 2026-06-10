import { prisma } from "@/lib/prisma";

type AuditParams = {
  userId: string;
  action: string;
  table: string;
  recordId: string;
  oldValue?: any;
  newValue?: any;
};

export async function logAction({
  userId,
  action,
  table,
  recordId,
  oldValue,
  newValue
}: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        table_affected: table,
        record_id: recordId,
        old_value: oldValue ?? undefined,
        new_value: newValue ?? undefined
      }
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
}
