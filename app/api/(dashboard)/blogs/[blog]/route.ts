import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/user";
import Blog from "@/lib/models/blog";

export const GET = async (request: Request, context: { params: { blog: string } }) => {
    const blogId = context.params.blog;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

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

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing BlogId" }),
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

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId,
        })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog does not exist" }),
                { status: 400 }
            )
        }

        return new NextResponse(JSON.stringify({ blog }),
            { status: 200 }
        )


    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(
            JSON.stringify({ message: "Error in fetching blog: " + errorMessage }),
            { status: 500 }
        );

    }
}

export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog;


    try {
        const body = await request.json();
        const { title, description } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing BlogId" }),
                { status: 400 })
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 400 }
            );
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
        });


        if (!blog) {
            return new NextResponse(JSON.stringify({
                message: "Blog not found"
            }),
                { status: 400 }
            );
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return new NextResponse(JSON.stringify({ message: "Blog Updated", blog: updatedBlog }),
            { status: 200 }
        )





    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(
            JSON.stringify({ message: "Error updating Blog: " + errorMessage }),
            { status: 500 }
        );
    }
}

export const DELETE = async(request: Request, context: {params: any}) => {
    const blogId = context.params.blog;
    
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing BlogId" }),
                { status: 400 })
        }

        await connect();
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(
            JSON.stringify({ message: "Error in Deleting blog: " + errorMessage }),
            { status: 500 }
        );
    }
}
