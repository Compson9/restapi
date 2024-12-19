import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/user";

// GET REQUEST FOR THE CATEGORIES
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await connect();

        const user = await User.findById(userId);

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        // Debug logging
        console.log(`Fetching categories for userId: ${userId}`);

        const categories = await Category.find({ user: new Types.ObjectId(userId) });

        // Debug logging
        console.log(`Categories found: ${categories.length}`);

        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (error: unknown) {
        // Handle errors
        console.error("Error in Fetching Categories:", error);
        if (error instanceof Error) {
            return new NextResponse("Error in Fetching Categories: " + error.message, { status: 500 });
        }
        return new NextResponse("Error in Fetching Categories", { status: 500 });
    }
};

// POST REQUEST TO CREATE A NEW CATEGORY
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const { title } = await request.json();

        // Validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        // Create a new category
        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId)
        });

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({ message: "Category created", category: newCategory }),
            { status: 201 }
        );
    } catch (error: unknown) {
        // Handle errors
        console.error("Error in Creating Category:", error);
        if (error instanceof Error) {
            return new NextResponse("Error in Creating Category: " + error.message, { status: 500 });
        }
        return new NextResponse("Error in Creating Category", { status: 500 });
    }
};
