import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const isbn = searchParams.get('isbn');

    if (!isbn) {
        return NextResponse.json({ message: "도서 정보가 유효하지 않습니다. (ISBN)" }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("review").aggregate([
            { $match: { book_isbn: isbn } }, // 조건에 맞는 리뷰 조회
            {
                $facet: {
                    data: [
                        { $sort: { created_at: -1 } },  // 최신순 정렬
                        {
                            $lookup: {                  // user 컬렉션과 조인
                                from: "user",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user_info",
                            },
                        },
                        { $unwind: "$user_info" },       // user_info 배열을 평탄화
                        {
                            $project: {                  // 필요한 필드만 선택
                                review_id: "$_id",
                                content: 1,
                                rating: 1,
                                like_count: 1,
                                date: {
                                    $dateToString: {
                                        format: "yyyy.MM.dd",
                                        date: {
                                            $add: ["$created_at", 9 * 60 * 60 * 1000],
                                        },
                                    },
                                },
                                nickname: "$user_info.nickname", // 닉네임 추가
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "count" }, // 전체 개수 계산
                    ],
                },
            },
        ]).toArray();

        const data = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.count || 0;

        return NextResponse.json({ data, totalCount }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}