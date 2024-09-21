'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function APITest() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/latest-list');
        console.log('API 응답:', response.data);
        setData(response.data);
      } catch (err) {
        setError('API 요청 중 오류가 발생했습니다.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!data) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>알라딘 API 테스트 결과</h1>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}