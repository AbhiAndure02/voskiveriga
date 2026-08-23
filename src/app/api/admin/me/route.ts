import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return errorResponse('User not found', 'USER_NOT_FOUND', 404);
    }

    return successResponse({ ...user, _id: user.id }, 'Current admin fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch current admin', 'ADMIN_ME_ERROR', 500);
  }
}
