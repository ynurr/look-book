import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("reading").aggregate([
            {
                $facet: {
                    readingBook: [
                        { $match: { user_id: new ObjectId(body.user_id), status: "0" }},
                        { $sort: { created_at: -1 } },
                        { $limit: 1 },
                        { $project: { _id: 0, book_isbn: 1, book_cover: 1 } } 
                    ],
                    completedBook: [
                        { $match: { user_id: new ObjectId(body.user_id), status: "1", review_id: null }},
                        { $sort: { created_at: -1 } },
                        { $limit: 1 },
                        { $project: { _id: 0, book_isbn: 1, book_cover: 1 } } 
                    ],
                    readingCount: [
                        { $match: { user_id: new ObjectId(body.user_id), status: "0" } },
                        { $count: "count" }
                    ],
                    completedCount: [
                        { $match: { user_id: new ObjectId(body.user_id), status: "1", review_id: null } },
                        { $count: "count" }
                    ]
                }
            }
        ]).toArray();
        
        return NextResponse.json({ result }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}