import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.review_id) {
        return NextResponse.json({ message: "리뷰 정보가 존재하지 않습니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("like").deleteOne({
            review_id: new ObjectId(body.review_id),
            user_id: new ObjectId(body.user_id),
        });

        if (result.deletedCount > 0) {
            await db.collection("review").updateOne(
                { _id: new ObjectId(body.review_id) },
                { $inc: { like_count: -1 } }
            );
        }
        
        return NextResponse.json({ message: "공감 해제 성공" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
