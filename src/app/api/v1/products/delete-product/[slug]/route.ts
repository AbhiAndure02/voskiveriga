import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

type RouteParams = {
  slug: string;
};

export async function DELETE(
  req: Request,
  context: { params: Promise<RouteParams> }
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

    const deletedProduct = await prisma.product.delete({
      where: { slug },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: {
          slug: deletedProduct.slug,
          name: deletedProduct.name,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Product Error:", error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
