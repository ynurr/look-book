import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.book_isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.book_status) {
        return NextResponse.json({ message: "독서 상태를 확인해주세요." }, { status: 400 });
    } 

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("reading").deleteOne(
            { user_id: new ObjectId(body.user_id), book_isbn: body.book_isbn }
        )

        if (result.deletedCount > 0) {

            if (body.review_id) {
                await db.collection("review").deleteOne({ _id: new ObjectId(body.review_id) });
                await db.collection("like").deleteMany({ review_id: new ObjectId(body.review_id) });
            }

            const count = body.book_status === '1' ? -1 : 0;
            const count2 = body.review_id ? -1 : 0;

            if (count < 0 || count2 < 0) {
                await db.collection("stat").updateOne(
                    { user_id: new ObjectId(body.user_id) },
                    {
                        $inc: { book_count: count, review_count: count2 },
                        $set: { updated_at: new Date() },
                    }
                );
            }
        }
        
        return NextResponse.json({ message: "독서현황 삭제 성공" }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}