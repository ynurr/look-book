import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const queryParam = searchParams.get('queryParam') || '';

    const params = new URLSearchParams({
        ttbkey: process.env.TTBKEY || '',
        ItemIdType: 'ISBN13',
        ItemId: queryParam,
        Cover: 'big',
        output: 'js',
        Version: '20131101'
    });

    const url = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?${params}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        return NextResponse.json({ error: 'API 요청 중 오류가 발생했습니다.' }, { status: 500 });
    }
}