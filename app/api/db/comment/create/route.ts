import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.review_id) {
        return NextResponse.json({ message: "리뷰 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.book_isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.content) {
        return NextResponse.json({ message: "댓글을 입력해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("comment").insertOne({
            review_id: new ObjectId(body.review_id),
            book_isbn: body.book_isbn,
            user_id: new ObjectId(body.user_id),
            parent_id: body.parent_id ? new ObjectId(body.parent_id) : null,
            content: body.content,
            created_at: new Date()
        })

        return NextResponse.json({ message: "댓글이 작성 성공" }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}