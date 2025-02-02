import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();

    if (!body.comment_id) {
        return NextResponse.json({ message: "댓글 정보가 존재하지 않습니다." }, { status: 400 });
    } else if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        await db.collection("comment").deleteOne({
            _id: new ObjectId(body.comment_id),
            user_id: new ObjectId(body.user_id),
        })

        await db.collection("comment").deleteMany({
            parent_id: new ObjectId(body.comment_id)
        });

        return NextResponse.json({ message: "댓글 삭제 성공" }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}