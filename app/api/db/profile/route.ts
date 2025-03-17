import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    } else if (!body.name) {
        return NextResponse.json({ message: "이름을 입력해주세요." }, { status: 400 });
    } else if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    } else if (!body.goal) {
        return NextResponse.json({ message: "목표를 설정해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("user").updateOne(
            { _id: new ObjectId(body.user_id) },
            { $set: { name: body.name, nickname: body.nickname } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
        }

        await db.collection("stat").updateOne(
            { user_id: new ObjectId(body.user_id) },
            { $set: { goal: body.goal } }
        )

        return NextResponse.json({ message: "프로필 수정 성공" }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "프로필 수정 중 오류가 발생했습니다." }, { status: 500 });
    }
}
