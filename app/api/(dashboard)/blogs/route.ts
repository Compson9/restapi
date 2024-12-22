import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import Blog from "@/lib/models/blog";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";

// GET REQUEST TO FETCH BLOGS BY CATEGORY AND USER
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const searchKeywords = searchParams.get("searchKeywords");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");





        // Validate userId and categoryId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await connect();

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 400 }
            );
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 400 }
            );
        }

        // Fetch blogs by user and category
        const filter: { user: Types.ObjectId; category: Types.ObjectId; $or?: { title: { $regex: string; $options: string }; description?: { $regex: string; $options: string } }[] } = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        };

        if (searchKeywords) {
            filter.$or = [
                { title: { $regex: searchKeywords, $options: "i" } },
                { title: { $regex: searchKeywords, $options: "i" }, description: { $regex: searchKeywords, $options: "i" } }
            ];
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate){
            filter.createdAt = {
                $gte: new Date(startDate)
            };
        } else if (endDate){
            filter.createdAt = {
                $lte: new Date(endDate)
            };
        }


        const blogs = await Blog.find(filter);
        return new NextResponse(JSON.stringify({ blogs }), { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(
            JSON.stringify({ message: "Error in fetching blogs: " + errorMessage }),
            { status: 500 }
        );
    }
};


// POST REQUEST TO CREATE A NEW BLOG
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const { title, description } = await request.json();

        // Validate userId and categoryId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await connect();

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 400 }
            );
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 400 }
            );
        }

        // Create a new blog
        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        });

        await newBlog.save();

        return new NextResponse(
            JSON.stringify({ message: "Blog created", blog: newBlog }),
            { status: 201 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(
            JSON.stringify({ message: "Error in creating blog: " + errorMessage }),
            { status: 500 }
        );
    }
};