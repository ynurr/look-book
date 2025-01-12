import { connectDB } from "@/util/database";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.sub) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection("wishlist").find({ user_id: new ObjectId(body.sub) }).toArray();

        if (result.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const data = result.map((i) => ({
            wish_id: i._id,
            isbn: i.book_isbn,
            title: i.book_title,
            author: i.book_author,
            cover: i.book_cover,
        }));

        return NextResponse.json( data , { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}