import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data: {
      isActive?: boolean;
      isVerified?: boolean;
      isAdmin?: boolean;
      role?: UserRole;
    } = {};

    if (typeof body.isActive === 'boolean') data.isActive = body.isActive;
    if (typeof body.isVerified === 'boolean') data.isVerified = body.isVerified;
    if (typeof body.isAdmin === 'boolean') {
      data.isAdmin = body.isAdmin;
      data.role = body.isAdmin ? UserRole.ADMIN : UserRole.USER;
    }
    if (body.role && Object.values(UserRole).includes(body.role)) {
      data.role = body.role;
      data.isAdmin = body.role === UserRole.ADMIN;
    }

    if (Object.keys(data).length === 0) {
      return errorResponse('No valid user fields supplied', 'NO_USER_UPDATE_FIELDS', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        role: true,
        isActive: true,
        isVerified: true,
        isAdmin: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(
      { ...updatedUser, _id: updatedUser.id },
      'User updated successfully'
    );
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return errorResponse(error.message || 'Failed to update user', 'ADMIN_USER_UPDATE_ERROR', 500);
  }
}
