import { connectDB } from "@/util/database";
import { differenceInDays } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.sub) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    }

    try {
        const db = (await connectDB).db("lookbook")
        
        const userStat = await db.collection("stat").findOne({ user_id: new ObjectId(body.sub) });

        if (!userStat) {
            return NextResponse.json({ message: "데이터가 존재하지 않습니다." }, { status: 404 });
        }

        const lastRead = userStat.updated_at? differenceInDays(new Date(), new Date(userStat.updated_at)) : "-"
        
        return NextResponse.json({
            bookCount: userStat.book_count,
            reviewCount: userStat.review_count,
            lastRead: lastRead
        }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}