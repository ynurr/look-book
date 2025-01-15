import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.sub) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("reading").find({ user_id: new ObjectId(body.sub) }).sort({ updated_at: -1 }).toArray();

        if (result.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const data = result.map((i) => ({
            isbn: i.book_isbn,
            title: i.book_title,
            author: i.book_author,
            cover: i.book_cover,
            status: i.status,
            review_id: i.review_id,
            rating: i.rating
        }));

        return NextResponse.json( data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}