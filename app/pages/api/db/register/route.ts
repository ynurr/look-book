import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json('ID를 입력해주세요.', { status: 500 })
    } else if (!body.password) {
        return NextResponse.json('비밀번호를 입력해주세요.', { status: 500 })
    } else if (!body.nickname) {
        return NextResponse.json('닉네임을 입력해주세요.', { status: 500 })
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        await db.collection('user').insertOne(body)
        return NextResponse.json('회원가입 성공', { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json('실패', { status: 500 })
    }
}
