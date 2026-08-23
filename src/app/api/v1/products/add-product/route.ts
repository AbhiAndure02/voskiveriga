import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductZodSchema } from "@/schemas/product.zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.isAdmin !== true) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed = ProductZodSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const slug =
      data.slug ??
      data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const sku = data.sku || `SKU-${Date.now()}`;

    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with same SKU/slug already exists",
        },
        { status: 409 }
      );
    }

    const { specifications, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        sku,
        specifications: specifications && specifications.length > 0
          ? {
              create: specifications.map((spec: { key: string; value: string }) => ({
                key: spec.key,
                value: spec.value,
              })),
            }
          : undefined,
      },
      include: {
        specifications: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Product Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
