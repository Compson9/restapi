import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/user";

// PATCH REQUEST TO UPDATE A CATEGORY
export const PATCH = async (request: Request, context: { params: { category: string } }) => {
    const categoryId = context.params.category;

    try {
        const body = await request.json(); // Parse request body
        const { title } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid or missing userId", { status: 400 });
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse("Invalid or missing categoryId", { status: 400 });
        }

        // Connect to the database
        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found in the database", { status: 400 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        if (!updatedCategory) {
            return new NextResponse("Category not found in the database", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({ message: "Category updated", category: updatedCategory }),
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error in Updating Category:", error);
        if (error instanceof Error) {
            return new NextResponse("Error in Updating Category: " + error.message, { status: 500 });
        }
        return new NextResponse("Error in Updating Category", { status: 500 });
    }
};

// DELETE REQUEST TO DELETE A CATEGORY
export const DELETE = async (request: Request, context: { params: { category: string } }) => {
    const categoryId = context.params.category;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid or missing userId", { status: 400 });
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse("Invalid or missing categoryId", { status: 400 });
        }

        // Connect to the database
        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found in the database", { status: 400 });
        }

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return new NextResponse("Category not found in the database", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({ message: "Category deleted", category: deletedCategory }),
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error in Deleting Category:", error);
        if (error instanceof Error) {
            return new NextResponse("Error in Deleting Category: " + error.message, { status: 500 });
        }
        return new NextResponse("Error in Deleting Category", { status: 500 });
    }
};