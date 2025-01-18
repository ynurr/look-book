import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (!body.status) {
        return NextResponse.json({ message: "유효하지 않은 상태입니다." }, { status: 400 });
    } else if (!body.user_id) {
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

        const result = await db.collection("reading").updateOne(
            {
                user_id: new ObjectId(body.user_id),
                book_isbn: body.book_isbn,
            },
            {
                $set: { 
                    status: body.status,
                    update_at: new Date()
                    },
                $setOnInsert: {
                    user_id: new ObjectId(body.user_id),
                    book_isbn: body.book_isbn,
                    book_title: body.book_title,
                    book_cover: body.book_cover,
                    book_author: body.book_author,
                    created_at: new Date()
                }
            },
            { upsert: true }
        )

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
             
            const count = body.status === '1' ? 1 : -1;

            await db.collection("stat").updateOne(
                { user_id: new ObjectId(body.user_id) },
                {
                    $inc: { book_count: count }, 
                    $set: { updated_at: new Date() },
                }
            )

            return NextResponse.json({ message: "독서 상태가 변경되었습니다." }, { status: 200 });
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}