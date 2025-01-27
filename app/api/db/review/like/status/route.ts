import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "사용자 정보가 존재하지 않습니다." }, { status: 400 })
    } else if (!body.review_id) {
        return NextResponse.json({ message: "리뷰 정보가 유효하지 않습니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("like").findOne({
            user_id: new ObjectId(body.user_id), 
            review_id: new ObjectId(body.review_id)
        })

        return NextResponse.json( !!result, { status: 200 });
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}