import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");
    
        const user = await db.collection("user").findOne({ _id: new ObjectId(body.user_id) });

        if (!user) {
            return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
        }

        if (body.password) {
            if (!user.password) {
                return NextResponse.json({ message: "SNS 로그인 계정은 비밀번호 설정이 불가능합니다." }, { status: 400 });
            }
            
            const isPasswordMatch = await bcrypt.compare(body.password, user.password);
            
            if (!isPasswordMatch) {
                return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 401 });
            }
        }
            
        const { id, name, nickname } = user;

        return NextResponse.json({ id, name, nickname }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "사용자 정보 조회 실패" }, { status: 500 });
    }
}