import { connectDB } from "@/util/database";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';
import { SessionStrategy } from 'next-auth';

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.username || !credentials.password) {
                    throw new Error("아이디와 비밀번호를 입력해주세요.");
                }

                const db = (await connectDB).db("lookbook");

                const user = await db.collection("user").findOne({ id: credentials.username });
                if (!user) {
                    throw new Error("존재하지 않는 사용자입니다.");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("비밀번호가 올바르지 않습니다.");
                }
                // JWT 발급을 위한 사용자 데이터 반환
                return { id: user.id, nickname: user.nickname, sub: user._id.toString() };
            },
        }),
    ],

    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 24 * 60 * 60 // 만료일 1일
    },

    callbacks: {
        // JWT 만들 때 실행
        async jwt ({ token, user }: { token: JWT, user: any }) {
            if (user) {
                token.id = user.id;
                token.nickname = user.nickname;
                token.sub = user.sub;
                console.log("[JWT Callback]: Token created", token);
            }
            return token;
        },
        // 유저 세션이 조회될 때마다 실행
        async session ({ session, token }: { session: any, token: JWT }) {
            session.user = {
                id: token.id,
                nickname: token.nickname,
                sub: token.sub,
            }
            console.log("[Session Callback]: Session created", session);
            return session;
        }
    },

    secret: JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };