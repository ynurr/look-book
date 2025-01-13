import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json()

    if (!body.user_id) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 })
    } else if (!body.book_isbn || !Array.isArray(body.book_isbn)) {
        return NextResponse.json({ message: "도서 정보가 존재하지 않습니다." }, { status: 400 })
    } 

    try {
        const db = (await connectDB).db("lookbook")

        const result = await db.collection('wishlist').deleteMany({ 
            $and: [
                { user_id: new ObjectId(body.user_id) },
                { book_isbn: { $in: body.book_isbn } },
            ]
        })
        
        if (result.deletedCount > 0) {
            return NextResponse.json({ message: "위시리스트 삭제 성공" }, { status: 200 })
        } else {
            return NextResponse.json({ message: "이미 삭제되었습니다." }, { status: 200 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 })
    }
}