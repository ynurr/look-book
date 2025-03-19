import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (!body.id) {
        return NextResponse.json({ message: "문의 정보가 유효하지 않습니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        await db.collection("inquiry").updateOne(
            { _id: new ObjectId(body.id) },
            { 
                $unset: { response: "", responded_at: "" }
            }
        );

        return NextResponse.json({ message: "답변 삭제 성공" }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "서버 오류로 인한 답변 삭제 실패" }, { status: 500 });
    }
}