import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const likes = await db.collection("like")
            .find({ user_id: new ObjectId(body.user_id) })
            .sort({ created_at: -1 })
            .toArray();
        const reviewIds = likes.map(i => new ObjectId(i.review_id));

        const reviews = await db.collection("review")
        .find(
            { _id: { $in: reviewIds } },
            { projection: { _id: 1, book_isbn: 1, book_title: 1, book_author: 1, content: 1, rating: 1 } }
        )
        .toArray();

        return NextResponse.json({ result: reviews }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
