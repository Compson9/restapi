import {NextResponse} from "next/server";
// import connect from "@/lib/db"
import User from "@/lib/models/user";
import connect from "@/lib/db";
import { Types } from "mongoose";


// eslint-disable-next-line @typescript-eslint/no-require-imports
const ObjectId = require("mongoose").Types.ObjectId;

// Get request from the api 
export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200})
    } catch (error: any) {
        return new NextResponse ("Error in Fetching Users" + error.message, {status: 500})
    }
} 

// Post request from the api
export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({message: "User is Created", user: newUser}),
        {status: 200}
    )
    } catch (error:any) {
        return new NextResponse ("Error in Fetching Users" + error.message, {status: 500})
    }
}

// Update database request from the api where users details can be altered 

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();

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

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Error in Updating User: " + error.message }),
            { status: 500 }
        );
    }
};

export const DELETE = async (request: Request) => {
try {
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId");
    
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

    await connect();

    const deleteUser = await User.findOneAndDelete(
        new Types.ObjectId(userId)
    );

if (!deleteUser){
    return new NextResponse(
        JSON.stringify({message: "User not found in the database"}),
        {status: 400}
    );
} 
 return new NextResponse(
    JSON.stringify({message: "User is deleted", user: deleteUser}),
    {status: 200}
 )


} catch (error: any) {
    return new NextResponse("Error in deleting user" + error.message, {
        status: 500
    })
}
}





