import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const review_id = searchParams.get('id');

    if (!review_id) {
        return NextResponse.json({ message: "리뷰 정보가 유효하지 않습니다." }, { status: 400 })
    }
    
    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("review").findOne({ _id: new ObjectId(review_id) });

        if (result) {
            const review = {
                    review_id: result._id,
                    rating: result.rating,
                    content: result.content,
            }

            return NextResponse.json({ review } , { status: 200 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}