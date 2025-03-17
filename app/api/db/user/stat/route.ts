import { connectDB } from "@/util/database";
import { differenceInDays } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const userStat = await db.collection("stat").aggregate([
            {
                $match: { user_id: new ObjectId(body.user_id) }
            },
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    _id: 0,
                    goal: 1,
                    bookCount: "$book_count",
                    reviewCount: "$review_count",
                    lastRead: {
                        $cond: {
                            if: { $gt: ["$updated_at", null] },
                            then: { $dateDiff: { startDate: "$updated_at", endDate: new Date(), unit: "day" } },
                            else: "-"
                        }
                    },
                    nickname: "$user_info.nickname" 
                }
            }
        ]).toArray();

        if (!userStat.length) {
            return NextResponse.json({ message: "데이터가 존재하지 않습니다." }, { status: 404 });
        }

        return NextResponse.json( userStat[0] , { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}