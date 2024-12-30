import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest) {
    const body = await req.json()

    if (!body.password) {
        return NextResponse.json({ message: "비밀번호를 입력해주세요." }, { status: 400 })
    } else if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    } else if (!body.sub) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const hashedPassword = await bcrypt.hash(body.password, 10)
        console.log("Hashed Password:", hashedPassword);
        console.log("body.password:", body.password);

        const result = await db.collection("user").updateOne(
            { _id: new ObjectId(body.sub) },
            {
                $set: {
                    password: hashedPassword,
                    nickname: body.nickname
                }
            }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ message: "회원 정보 수정 성공" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}
