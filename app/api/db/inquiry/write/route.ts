import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.user_id) {
        return NextResponse.json({ message: "사용자 정보가 존재하지 않습니다." }, { status: 400 })
    } else if (!body.title) {
        return NextResponse.json({ message: "문의 제목을 작성해주세요." }, { status: 400 });
    } else if (!body.content) {
        return NextResponse.json({ message: "문의 내용을 작성해주세요." }, { status: 400 });
    }
    
    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection("inquiry").insertOne({
            user_id: new ObjectId(body.user_id),
            title: body.title,
            content: body.content,
            response: null,
            created_at: new Date()
        })

        if (result.insertedId) {
            return NextResponse.json({ message: "문의글 작성 성공" }, { status: 200 })
        }
            
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }

}