import { connectDB } from "@/util/database";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const reviews = await db.collection("review")
            .find({ user_id: new ObjectId(body.user_id) })
            .toArray();
        const reviewIds = reviews.map(review => review._id); 
        
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const comments = await db.collection("comment")
            .find({
                review_id: { $in: reviewIds },
                created_at: { $gte: lastMonth }
            }, { limit: body.limit })
            .toArray();

        const userIds = comments.map(comment => comment.user_id);
        const users = await db.collection("user")
            .find({ _id: { $in: userIds } })
            .toArray();
        
        const userMap = new Map(users.map(user => [user._id.toString(), user.nickname]));

        const result = reviews.map(review => {
            const reviewComments = comments.filter(comment => comment.review_id.toString() === review._id.toString());

            return reviewComments.map(comment => {
                let book_title = review.book_title;

                if (comment.parent_id) {
                    const parentComment = comments.find(c => c._id.toString() === comment.parent_id.toString());

                    if (parentComment) {
                        book_title = parentComment.content;
                    }
                }

                return {
                    gubun: comment.parent_id ? 'reply' : 'comment',
                    isbn: comment.book_isbn,
                    book_title: book_title,
                    content: comment.content,
                    created_at: comment.created_at,
                    nickname: userMap.get(comment.user_id.toString()), 
                    user_id: comment.user_id.toString(),
                };
            });
        }).flat();

        const finalResult = result.filter(comment => comment.user_id !== body.user_id);

        return NextResponse.json({ result: finalResult }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
