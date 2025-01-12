import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.sub) {
        return NextResponse.json({ message: "사용자 정보가 존재하지 않습니다." }, { status: 400 })
    } else if (!body.isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.content) {
        return NextResponse.json({ message: "리뷰 내용을 작성해주세요." }, { status: 400 });
    } else if (!body.rating) {
        return NextResponse.json({ message: "별점을 평가해주세요." }, { status: 400 });
    }
    
    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection('reading').updateOne(
            { user_id: new ObjectId(body.sub), book_isbn: body.book_isbn },
            {
                $set: {
                    content: body.content,
                    rating: body.rating,
                    status : 2,
                    like_count : 0,
                    updated_at: new Date()
                },
                $setOnInsert: {
                    user_id: new ObjectId(body.sub),
                    book_isbn: body.isbn,
                    book_title: body.title,
                    book_cover: body.cover,
                    book_author: body.author,
                    created_at: new Date(),
                },
            },
            { upsert: true }
        )

        if (result.upsertedCount > 0 || result.modifiedCount > 0) {
            await db.collection('stat').updateOne(
                { user_id: new ObjectId(body.sub) },
                {
                    $inc: { review_count: 1 }, 
                    $set: { updated_at: new Date() },
                }
            )
        }

        return NextResponse.json({ message: "리뷰 작성 성공" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }

}