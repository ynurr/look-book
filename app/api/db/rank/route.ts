import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("stat").aggregate([
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_info",
                }
            },
            { $unwind: "$user_info" }, 
            {
                $project: {
                    _id: 0,
                    nickname: "$user_info.nickname",
                    book_count: 1
                }
            },
            {
                $sort: { book_count: -1, review_count: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray();

        return NextResponse.json({ result }, { status: 200 });
    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}