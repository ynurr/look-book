import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const now = new Date();
        const startDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6, 0, 15, 0, 0));
        const endDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 14, 59, 59, 999));

        console.log("📅 검색 기간 (UTC):", startDateUTC.toISOString(), " ~ ", endDateUTC.toISOString());

        const pipeline = [
            {
                $match: {
                    user_id: new ObjectId(body.user_id),
                    updated_at: { $gte: startDateUTC, $lte: endDateUTC },
                    status: "1"
                }
            },
            {
                $project: {
                    year: { $year: { date: "$updated_at", timezone: "Asia/Seoul" } },
                    month: { $month: { date: "$updated_at", timezone: "Asia/Seoul" } },
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ];

        const result = await db.collection("reading").aggregate(pipeline).toArray();

        console.log("📊 MongoDB 조회 결과:", result);

        // 최근 7개월 데이터 생성
        const monthlyData: { [key: string]: number } = {};

        for (let i = 6; i >= 0; i--) {
            const tempDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1}`;
            monthlyData[key] = 0;
        }

        console.log("📌 기본 월별 데이터 초기화:", monthlyData);

        result.forEach(({ _id, count }) => {
            const key = `${_id.year}-${_id.month}`;
            if (monthlyData[key] !== undefined) {
                monthlyData[key] = count;
            }
        });

        console.log("✅ 최종 월별 데이터:", monthlyData);

        const data = Object.entries(monthlyData).map(([date, count]) => ({
            month: date, 
            count
        }));

        console.log("🚀 API 응답 데이터:", data);
        
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("API 오류 발생:", error);
        return NextResponse.json({ message: "오류가 발생했습니다." }, { status: 500 });
    }
}
