import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    } else if (!body.book_isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    }
    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("reading").findOne({ user_id: new ObjectId(body.user_id), book_isbn: body.book_isbn });
        
        return NextResponse.json({ status: result?.status ?? null, review_id: result?.review_id ?? null } , { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}