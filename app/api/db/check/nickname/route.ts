import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const nickname = searchParams.get('nickname');

    if (!nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const existing = await db.collection("user").findOne({ nickname: nickname });

        if (existing) {
            return NextResponse.json({ message: "사용 중인 닉네임입니다." }, { status: 208 });
        }

        return NextResponse.json({ message: "사용 가능한 닉네임입니다." }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "닉네임 중복 체크 실패" }, { status: 500 });
    }
}