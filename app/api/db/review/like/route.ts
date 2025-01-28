import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "사용자 정보가 존재하지 않습니다." }, { status: 400 })
    } else if (!body.review_id) {
        return NextResponse.json({ message: "리뷰 정보가 유효하지 않습니다." }, { status: 400 });
    } else if (!body.book_isbn) {
        return NextResponse.json({ message: "도서 정보가 유효하지 않습니다." }, { status: 400 });
    } else if (typeof body.isLike !== 'boolean') {
        return NextResponse.json({ message: "좋아요 상태를 확인해주세요." }, { status: 400 });
    }

    const count = body.isLike ? 1 : -1;

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("review").updateOne(
            { _id: new ObjectId(body.review_id) },
            { $inc: { like_count: count } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "리뷰를 찾을 수 없습니다." }, { status: 404 });
        }
        if (result.modifiedCount > 0) {

            if (body.isLike) {
                await db.collection("like").insertOne({ 
                    user_id: new ObjectId(body.user_id), 
                    review_id: new ObjectId(body.review_id),
                    book_isbn: body.book_isbn,
                    created_at: new Date()
                })
            } else {
                await db.collection("like").deleteOne({
                    user_id: new ObjectId(body.user_id), 
                    review_id: new ObjectId(body.review_id)
                })
            }

            return NextResponse.json({ message: "좋아요 업데이트 성공" }, { status: 200 });
        }
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}