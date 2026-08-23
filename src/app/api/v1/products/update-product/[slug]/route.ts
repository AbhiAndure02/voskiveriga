import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.isAdmin !== true) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Invalid product slug" },
        { status: 400 }
      );
    }

    const body = await req.json();

    delete body.slug;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.id;
    delete body._id;

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const { specifications, ...productData } = body;

    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        ...productData,
      },
      include: {
        specifications: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}
