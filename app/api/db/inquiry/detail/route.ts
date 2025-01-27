import { connectDB } from "@/util/database";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const inquiry_id = searchParams.get('id');

    if (!inquiry_id) {
        return NextResponse.json({ message: "문의글이 유효하지 않습니다." }, { status: 400 })
    }
    
    try {
        const db = (await connectDB).db("lookbook");
        
        const result = await db.collection("inquiry").findOne({ _id: new ObjectId(inquiry_id) });

        if (result) {
            const data = {
                    title: result.title,
                    content: result.content,
                    response: result.response ?? "",
                    created_at: result.created_at
                        ? format(new Date(new Date(result.created_at).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10), "yyyy.MM.dd")
                        : "",
                    responded_at: result.responded_at
                        ? format(new Date(new Date(result.responded_at).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10), "yyyy.MM.dd")
                        : "",
            }

            return NextResponse.json({ data } , { status: 200 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}