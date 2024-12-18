import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/user"


// GET REQUEST FOR THE CATEGORIES
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId");
         
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "ID is not found"}), 
        {status: 400,}
        )
        }




    } catch (error: any) {

    }

}