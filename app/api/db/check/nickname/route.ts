import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")

        const existing = await db.collection("user").findOne({ nickname: body.nickname })

        if (existing) {
            return NextResponse.json({ message: "사용 중인 닉네임입니다." }, { status: 409 })
        }

        return NextResponse.json({ message: "사용 가능한 닉네임입니다." }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "닉네임 중복 체크 실패" }, { status: 500 })
    }
}