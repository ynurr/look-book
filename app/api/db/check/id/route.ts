import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ message: "아이디를 입력해주세요." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")

        const existing = await db.collection("user").findOne({ id: body.id })

        if (existing) {
            return NextResponse.json({ message: "사용 중인 아이디입니다." }, { status: 409 })
        }

        return NextResponse.json({ message: "사용 가능한 아이디입니다." }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "아이디 중복 체크 실패" }, { status: 500 })
    }
}