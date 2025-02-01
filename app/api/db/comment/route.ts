import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const isbn = searchParams.get('isbn');

    if (!isbn) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 });
    } 
    
    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("comment").aggregate([
            { $match: { book_isbn: isbn } },
            {
                $facet: {
                    data: [
                        { $sort: { created_at: 1 } },
                        {
                            $lookup: {
                                from: "user",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "user_info",
                            }
                        },
                        { $unwind: "$user_info" },
                        {
                            $project: {
                                comment_id: "$_id",
                                review_id: 1,
                                user_id: 1,
                                content: 1,
                                parent_id: 1,
                                date: {
                                    $dateToString: {
                                        format: "%Y.%m.%d %H:%M:%S",
                                        date: {
                                            $add: ["$created_at", 9 * 60 * 60 * 1000],
                                        },
                                    },
                                },
                                nickname: "$user_info.nickname", 
                            }
                        }
                    ],
                    commentCount: [
                        {
                            $group: {
                                _id: "$review_id",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]).toArray();

        const data = result[0]?.data || [];
        const commentCount = result[0]?.commentCount || [];

        const dataWithCount = data.map((comment: any) => {
            const commentCountData = commentCount.find((item: any) => item._id === comment.review_id);
            comment.comment_count = commentCountData ? commentCountData.count : 0;
            return comment;
        })
        
        return NextResponse.json({ data: dataWithCount }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}