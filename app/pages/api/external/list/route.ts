import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || '';
  const max = searchParams.get('max') || '';
  const page = searchParams.get('page') || '1'; 

  const params = new URLSearchParams({
    ttbkey: process.env.TTBKEY || '',
    QueryType: type,
    MaxResults: max,
    // CategoryId: '1',
    Cover: 'big',
    start: '1',
    SearchTarget: 'Book',
    output: 'js',
    Version: '20131101'
  });

  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${params}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data1 = await response.json();
    let combinedData = data1;

    if (page === '1') {
      combinedData = [...data1.item]
    }
    if (page === 'all') {
      const paramsPage2 = new URLSearchParams({
        ttbkey: process.env.TTBKEY || '',
        QueryType: type,
        MaxResults: max,
        Cover: 'big',
        start: '2', 
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101'
      });

      const url2 = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${paramsPage2}`;
      const response2 = await fetch(url2);

      if (!response2.ok) {
        throw new Error('API2 요청 실패');
      }

      const data2 = await response2.json();
      combinedData = [...data1.item, ...data2.item]; 
    }

    return NextResponse.json(combinedData);

  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    return NextResponse.json({ error: 'API 요청 중 오류가 발생했습니다.' }, { status: 500 });
  }
}