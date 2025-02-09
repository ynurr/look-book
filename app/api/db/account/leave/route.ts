import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();

    if (!body.sub) {
        return NextResponse.json({ message: "유효하지 않은 사용자 ID입니다." }, { status: 400 });
    }

    try {
        const db = (await connectDB).db("lookbook");

        const result = await db.collection("user").deleteOne({ _id: new ObjectId(body.sub) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "존재하지 않는 회원입니다." }, { status: 404 });
        } else {
            await db.collection("wishlist").deleteOne({ user_id: new ObjectId(body.sub) });
            await db.collection("stat").deleteOne({ user_id: new ObjectId(body.sub) });
            await db.collection("reading").deleteMany({ user_id: new ObjectId(body.sub) });
            await db.collection("review").deleteMany({ user_id: new ObjectId(body.sub) });
            await db.collection("like").deleteMany({ user_id: new ObjectId(body.sub) });
            await db.collection("inquiry").deleteMany({ user_id: new ObjectId(body.sub) });
            await db.collection("comment").deleteMany({ user_id: new ObjectId(body.sub) });
        }
        
        return NextResponse.json({ message: "회원 탈퇴 성공" }, { status: 200 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "실패" }, { status: 500 });
    }
}