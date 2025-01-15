import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (!body.status) {
        return NextResponse.json({ message: "유효하지 않은 상태입니다." }, { status: 400 });
    } else if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.book_isbn || !Array.isArray(body.book_isbn)) {
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

        for (let i = 0; i < body.book_isbn.length; i++) {
            const result = await db.collection("reading").updateOne(
                {
                    user_id: new ObjectId(body.user_id),
                    book_isbn: body.book_isbn[i],
                },
                {
                    $set: { 
                        status: body.status[i],
                        update_at: new Date()
                     },
                    $setOnInsert: {
                        user_id: new ObjectId(body.user_id),
                        book_isbn: body.book_isbn[i],
                        book_title: body.book_title[i],
                        book_cover: body.book_cover[i],
                        book_author: body.book_author[i],
                        created_at: new Date()
                    }
                },
                { upsert: true }
            );

            if (result.modifiedCount > 0 || result.upsertedCount > 0) {
                return NextResponse.json({ message: "독서 상태가 변경되었습니다." }, { status: 200 });
            }
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}