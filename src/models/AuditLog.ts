import prisma from '@/lib/prisma';

export type IAuditLog = {
  id: string;
  _id?: string;
  adminId?: string | null;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: any;
  createdAt: Date;
};

export const AuditLogModel = prisma.auditLog;

export default AuditLogModel;
