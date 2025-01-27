import { connectDB } from "@/util/database";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection("inquiry")
            .find({ user_id: new ObjectId(body.user_id) })
            .sort({ created_at: -1 })
            .toArray();
        
        if (result.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        
        const data = result.map((i) => ({
            inquiry_id: i._id,
            title: i.title,
            content: i.content,
            status: i.response ? "답변완료" : "미답변",
            created_at: i.created_at
                ? format(new Date(new Date(i.created_at).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10), "yyyy.MM.dd")
                : "",
        }));

        return NextResponse.json( data , { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}