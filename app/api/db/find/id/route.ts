import { connectDB } from "@/util/database"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.name) {
        return NextResponse.json({ message: "이름을 입력해주세요." }, { status: 400 })
    } else if (!body.nickname) {
        return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection('user').findOne({
            name: body.name,
            nickname: body.nickname
        });
        
        if (!result) {
            return NextResponse.json({ id: '' }, { status: 200 });
        }

        return NextResponse.json({ id: result.id }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
    
}
