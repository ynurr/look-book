import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    ttbkey: 'ttb0305_080616001',
    Cover: 'big',
    QueryType: 'ItemEditorChoice',
    CategoryId: '1',
    MaxResults: '1',
    start: '1',
    SearchTarget: 'Book',
    output: 'js',
    Version: '20131101'
  });

  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${params}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data = await response.json();

    // JSON 형식으로 응답
    return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
    });
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    // 오류 발생 시 JSON 형식으로 오류 메시지 반환
    return NextResponse.json({ error: 'API 요청 중 오류가 발생했습니다.' }, { status: 500 });
  }
}