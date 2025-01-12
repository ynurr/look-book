import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.book_isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.book_title) {
        return NextResponse.json({ message: "도서 제목을 확인할 수 없습니다." }, { status: 400 });
    } else if (!body.book_author) {
        return NextResponse.json({ message: "해당 도서의 작가를 확인할 수 없습니다." }, { status: 400 });
    } else if (!body.book_cover) {
        return NextResponse.json({ message: "도서의 표지 정보가 존재하지 않습니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");
        
        body.user_id = new ObjectId(body.user_id);
        body.created_at = new Date();

        const result = await db.collection('wishlist').insertOne(body);

        if (result.insertedId) {
            return NextResponse.json({ message: "위시리스트 추가 성공" }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}