import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const isbn = searchParams.get('isbn');
    const review_id = searchParams.get('id');

    if (!isbn && !review_id) {
        return NextResponse.json({ message: "ISBN 또는 리뷰 ID가 필요합니다." }, { status: 400 });
    } 
    
    let query = {};
    
    if (isbn) {
        query = { book_isbn: isbn };
    } else if (review_id) {
        query = { review_id: new ObjectId(review_id) };
    }
    
    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("comment").aggregate([
            { $match: query },
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