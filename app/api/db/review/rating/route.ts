import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const isbn = searchParams.get('isbn');

    if (!isbn) {
        return NextResponse.json({ message: "도서 정보가 유효하지 않습니다. (ISBN)" }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("review").aggregate([
            {
                $match: { book_isbn: isbn }
            },
            {
                $group: {
                    _id: 0,
                    avgRating: { $avg: "$rating" },
                    totalCount: { $sum: 1 }
                }
            }
        ]).toArray();

        const data = result.length > 0 
            ? { avgRating: result[0].avgRating.toFixed(1), totalCount: result[0].totalCount }
            : { avgRating: "0.0", totalCount: 0 };
            
        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}