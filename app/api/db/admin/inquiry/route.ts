import { connectDB } from "@/util/database";
import { NextResponse } from "next/server";
import { addHours, format } from "date-fns";

export async function GET() {
    try {
        const db = (await connectDB).db("lookbook");
        const inquiries = await db.collection("inquiry")
            .find()
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json(inquiries.map((i) => ({
            inquiry_id: i._id.toString(),
            title: i.title,
            date: i.created_at 
            ? format(addHours(new Date(i.created_at), 9), "yyyy.MM.dd")
            : "",
            status: i.response ? "answered" : "pending",
        })));
    } catch (error) {
        console.error("관리자 문의 내역 조회 실패:", error);
        return NextResponse.json({ message: "서버 오류" }, { status: 500 });
    }
}
