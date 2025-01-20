import { connectDB } from "@/util/database";
import { format } from "date-fns";
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
        
        const readingResult = await db.collection("reading").findOne({ user_id: new ObjectId(body.user_id), book_isbn: body.book_isbn });
        
        if (!readingResult) {
            return NextResponse.json({ message: "독서 정보가 존재하지 않습니다." }, { status: 404 });
        }
        
        const reviewResult = await db.collection("review").findOne({ user_id: new ObjectId(body.user_id), book_isbn: body.book_isbn });

        const reading = {
            reading_id: readingResult._id,
            isbn: readingResult.book_isbn,
            title: readingResult.book_title,
            author: readingResult.book_author,
            cover: readingResult.book_cover,
            status: readingResult.status,
            // review_id: readingResult.review_id,
        };

        const review = reviewResult ? 
            {
                review_id: reviewResult._id,
                rating: reviewResult.rating,
                content: reviewResult.content,
                like_count: reviewResult.like_count,
                created_at: reviewResult.created_at
                    ? format(new Date(new Date(reviewResult.created_at).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10), "yyyy.MM.dd")
                    : "",
            } : null;

        return NextResponse.json({ reading, review } , { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}