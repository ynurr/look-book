import { connectDB } from "@/util/database";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';
import { SessionStrategy } from 'next-auth';
import KakaoProvider from "next-auth/providers/kakao";

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
        // 카카오 프로바이더
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!
        })
    ],

    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 12 * 60 * 60, // 만료일 12시간
        updateAge: 0,
    },

    callbacks: {
        async signIn({ account, profile }: { account?: any, profile?: any }) {
            const db = (await connectDB).db("lookbook");
    
            // 카카오 로그인
            if (account?.provider === "kakao") {
                const existingUser = await db.collection("user").findOne({ sns_id: profile.id });
    
                if (!existingUser) {
                    console.log("🆕 [카카오 최초 로그인] 회원가입 진행:", profile);
    
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/db/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            sns_id: profile.id,
                            id: `kakao_${profile.id}`,
                            name: profile.properties?.nickname,
                            nickname: profile.properties?.nickname,
                            goal: 12,
                        }),
                    })

                    if (response.status !== 200) {
                        console.error("❌ 회원가입 실패", await response.text());
                        return false;
                    }

                    console.log("✅ [회원가입 완료] 새로운 유저 생성됨:");
                }
            }
    
            return true; // 로그인 진행
        },
        
        // JWT 만들 때 실행
        async jwt({ token, user, account, profile }: { token: JWT, user: any, account?: any, profile?: any }) {
            if (user) {
                token.id = user.id;
                token.nickname = user.nickname;
                token.sub = user.sub;

                console.log("[JWT Callback]: Token created", token);
            }

            // 카카오 로그인
            if (account?.provider === "kakao") {
                console.log("🔹 [카카오 로그인] account:", account);
                console.log("🔹 [카카오 로그인] profile:", profile);

                const db = (await connectDB).db("lookbook");
                const existingUser = await db.collection("user").findOne({ sns_id: profile.id });

                if (existingUser) {
                    token.id = existingUser.id;
                    token.nickname = existingUser.nickname;
                    token.sub = existingUser._id.toString();

                    console.log("[Kakao - JWT Callback]: Token created", token);
                }
            }

            console.log("[JWT Callback]: Using existing Token", token);

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