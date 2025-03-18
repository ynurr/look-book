import { connectDB } from "@/util/database";
import { NextRequest, NextResponse } from "next/server";
import { addHours, format } from "date-fns";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: "문의 내역 ID 값이 유효하지 않습니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");
        const inquiry = await db.collection("inquiry").findOne({ _id: new ObjectId(id) });

        if (!inquiry) {
            return NextResponse.json({ message: "문의 내역을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({
            inquiry_id: inquiry._id.toString(),
            title: inquiry.title,
            content: inquiry.content,
            date: inquiry.created_at
                ? format(addHours(new Date(inquiry.created_at), 9), "yyyy.MM.dd")
                : "",
            status: inquiry.response ? "answered" : "pending",
            response: inquiry.response || "",
            responded_date: inquiry.responded_at
                ? format(addHours(new Date(inquiry.created_at), 9), "yyyy.MM.dd")
                : "",
        });
    } catch (error) {
        console.error("관리자 문의 상세 조회 실패:", error);
        return NextResponse.json({ message: "서버 오류" }, { status: 500 });
    }
}
