import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.id) {
        return NextResponse.json({ message: "문의 정보가 유효하지 않습니다." }, { status: 400 });
    } else if (!body.response) {
        return NextResponse.json({ message: "답변을 입력해주세요." }, { status: 400 });
    }
    
    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("inquiry").updateOne(
            { _id: new ObjectId(body.id) },
            {
                $set: {
                    response: body.response,
                    responded_at: new Date()
                }
            }
        )
        
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "문의 내역을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ message: "답변 등록 성공" }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "서버 오류로 인한 등록 실패" }, { status: 500 });
    }

}