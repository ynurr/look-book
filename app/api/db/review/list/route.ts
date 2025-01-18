import { connectDB } from "@/util/database";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const user_id = searchParams.get('id');

    if (!user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection("review").find({ user_id: new ObjectId(user_id) }).sort({ created_at: -1 }).toArray();

        if (result.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        
        const data = result.map((review) => ({
            review_id: review._id,
            isbn: review.book_isbn,
            title: review.book_title,
            cover: review.book_cover,
            rating: review.rating,
            content: review.content,
            like_count: review.like_count,
            created_at: review.created_at
                ? format(new Date(new Date(review.created_at).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10), "yyyy.MM.dd")
                : "",
        }));

        return NextResponse.json( data , { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}