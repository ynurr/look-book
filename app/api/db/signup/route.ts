import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ message: "ID를 입력해주세요." }, { status: 400 })
    } else if (!body.password) {
        return NextResponse.json({ message: "비밀번호를 입력해주세요." }, { status: 400 })
    } else if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const hashedPassword = await bcrypt.hash(body.password, 10)
        body.password = hashedPassword

        await db.collection('user').insertOne(body)
        return NextResponse.json({ message: "회원가입 성공" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}
