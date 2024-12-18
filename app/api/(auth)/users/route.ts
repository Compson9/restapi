import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import connect from "@/lib/db";
import { Types } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require("mongoose").Types.ObjectId;

// GET request to fetch all users
export const GET = async () => {
    try {
        await connect(); // Connect to the database
        const users = await User.find(); // Fetch all users
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in Fetching Users: " + error.message, { status: 500 });
        }
        return new NextResponse("Unknown error in Fetching Users", { status: 500 });
    }
};

// POST request to create a new user
export const POST = async (request: Request) => {
    try {
        const body = await request.json(); // Parse request body
        await connect(); // Connect to the database
        const newUser = new User(body); // Create a new user
        await newUser.save(); // Save the new user
        return new NextResponse(
            JSON.stringify({ message: "User is Created", user: newUser }),
            { status: 200 }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in Creating User: " + error.message, { status: 500 });
        }
        return new NextResponse("Unknown error in Creating User", { status: 500 });
    }
};

// PATCH request to update user details
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json(); // Parse request body
        const { userId, newUsername } = body;

        await connect(); // Connect to the database

        // Validate userId and newUsername
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "Id or new Username not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid User Id" }),
                { status: 400 }
            );
        }

        // Update the user
        const updateUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updateUser) {
            return new NextResponse(
                JSON.stringify({ message: "User is not found in the database" }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updateUser }),
            { status: 200 }
        );

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Error in Updating User: " + (error as Error).message }),
            { status: 500 }
        );
    }
};

// DELETE request to delete a user
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Id or new Username not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid User Id" }),
                { status: 400 }
            );
        }

        await connect(); // Connect to the database

        // Delete the user
        const deleteUser = await User.findOneAndDelete(new Types.ObjectId(userId));

        if (!deleteUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deleteUser }),
            { status: 200 }
        );

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in deleting user: " + error.message, {
                status: 500
            });
        }
        return new NextResponse("Unknown error in deleting user", {
            status: 500
        });
    }
};





