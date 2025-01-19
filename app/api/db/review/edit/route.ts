import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (!body.review_id) {
        return NextResponse.json({ message: "리뷰 정보가 유효하지 않습니다." }, { status: 400 });
    } else if (!body.content) {
        return NextResponse.json({ message: "리뷰 내용을 작성해주세요." }, { status: 400 });
    } else if (!body.rating) {
        return NextResponse.json({ message: "별점을 평가해주세요." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const result = await db.collection("review").updateOne(
            { _id: new ObjectId(body.review_id) },
            {
                $set: {
                    content: body.content,
                    rating: body.rating,
                    updated_at: new Date()
                }
            }
        )
        
        if (result.modifiedCount > 0) {
            return NextResponse.json({ message: "리뷰 수정 성공" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "리뷰가 존재하지 않습니다." }, { status: 404 });
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}