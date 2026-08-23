import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 200);

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(
      logs.map((log) => ({
        ...log,
        _id: log.id,
      })),
      'Audit logs fetched successfully'
    );
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return errorResponse(error.message || 'Failed to fetch audit logs', 'AUDIT_LOGS_ERROR', 500);
  }
}
