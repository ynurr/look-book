'use client'

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSession } from 'next-auth/react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const dataLabelPlugin = {
    id: 'dataLabelPlugin',
    afterDatasetsDraw: (chart: any) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset: any, i: number) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar: any, index: number) => {
                const data = dataset.data[index];
                ctx.fillStyle = '#333'; 
                ctx.font = '10px Pretendard'; 
                ctx.textAlign = 'center';
                ctx.fillText(data, bar.x, bar.y - 5);
            });
        });
    },
};

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 13,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: () => '',
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
        },
        y: {
            grid: {
                display: true,
                drawTicks: false,
            },
            ticks: {
                display: false,
                stepSize: 5, 
            },
            border: {
                display: false,
            },
        },
    },
};

export default function BarChart() {
 
    const { data: session, status } = useSession();
    const [chartData, setChartData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        const fetchMonthlyStat = async () => {
            if (status === 'authenticated' && session?.user.sub) {
                try {
                    const response = await fetch('/api/db/monthly', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_id: session.user.sub }),
                    });
    
                    const data = await response.json();
    
                    // 날짜 기준 정렬 (연-월 순서 유지)
                    const sortedData = data.sort((a: any, b: any) => {
                        const [yearA, monthA] = a.month.split('-').map(Number);
                        const [yearB, monthB] = b.month.split('-').map(Number);
                        return yearA !== yearB ? yearA - yearB : monthA - monthB;
                    });
    
                    setLabels(sortedData.map((d: any) => `${Number(d.month.split('-')[1])}월`));
                    setChartData(sortedData.map((d: any) => d.count));
    
                } catch (error) {
                    console.log('에러');
                }
            }
        };
    
        fetchMonthlyStat();
    }, [session]);

    const rankColor = new Array(chartData.length).fill("#e6f5bf");
    if (rankColor.length > 0) rankColor[rankColor.length - 1] = "#cfdffc";

    const data = {
        labels,
        datasets: [
            {
                label: 'Data',
                data: chartData,
                backgroundColor: rankColor,
                borderColor: rankColor,
                hoverBackgroundColor: rankColor,
                hoverBorderColor: rankColor,
            },
        ],
    };

    return (
        <div className='contentWrap'>
            <div className='contentInner'>
                <Bar 
                    options={options} 
                    data={data} 
                    // height={84} 
                    plugins={[dataLabelPlugin]} 
                />
            </div>
        </div>
    );
}