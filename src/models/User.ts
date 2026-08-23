import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

export { UserRole };

export interface Profile {
  id?: string;
  type: 'personal' | 'business';
  name: string;
  address?: string;
  businessName?: string;
  gstNumber?: string;
  isActive: boolean;
}

export type User = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  number?: string | null;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isAdmin: Boolean;
  otp?: string | null;
  otpExpiry?: Date | null;
  lastLoginAt?: Date | null;
  profiles?: Profile[];
  createdAt: Date;
  updatedAt: Date;
};

export default prisma.user;
