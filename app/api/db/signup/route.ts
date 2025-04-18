import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ message: "ID를 입력해주세요." }, { status: 400 })
    } else if (!body.name) {
        return NextResponse.json({ message: "이름을 입력해주세요." }, { status: 400 })
    // } else if (!body.password) {
    //     return NextResponse.json({ message: "비밀번호를 입력해주세요." }, { status: 400 })
    } else if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    } else if (!body.goal) {
        return NextResponse.json({ message: "독서 목표를 설정해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");
        
        if (body.password) {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            body.password = hashedPassword;
        }

        body.created_at = new Date();

        const result = await db.collection('user').insertOne(body);

        if (result.insertedId) {
            await db.collection('stat').insertOne({
                user_id: new ObjectId(result.insertedId),
                goal: body.goal,
                book_count: 0,
                review_count: 0
            })
        }

        return NextResponse.json({ message: "회원가입 성공" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
    
}
