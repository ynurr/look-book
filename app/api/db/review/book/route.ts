import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const isbn = searchParams.get('isbn');
    const sort = searchParams.get('sort');

    if (!isbn) {
        return NextResponse.json({ message: "도서 정보가 유효하지 않습니다. (ISBN)" }, { status: 400 });
    } else if (!sort) {
        return NextResponse.json({ message: "리뷰 정렬 기준이 누락되었습니다." }, { status: 400 });
    }
    
    try {
        const db = (await connectDB).db("lookbook");
    
        let sortReview = {};
            
        if (sort === '0') {
            sortReview = { created_at: -1 };
        } else if (sort === '1') {
            sortReview = { rating: -1 };
        } else if (sort === '2') {
            sortReview = { rating: 1 };
        }
        
        const result = await db.collection("review").aggregate([
            { $match: { book_isbn: isbn } },
            {
                $facet: {
                    data: [
                        { $sort: sortReview }, 
                        {
                            $lookup: {
                                from: "user",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user_info",
                            },
                        },
                        { $unwind: "$user_info" },
                        {
                            $project: {
                                review_id: "$_id",
                                content: 1,
                                rating: 1,
                                like_count: 1,
                                date: {
                                    $dateToString: {
                                        format: "%Y.%m.%d",
                                        date: {
                                            $add: ["$created_at", 9 * 60 * 60 * 1000],
                                        },
                                    },
                                },
                                nickname: "$user_info.nickname",
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "count" }, 
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