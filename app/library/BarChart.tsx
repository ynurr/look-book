'use client'

import React from 'react';
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
                display: false,
            },
            ticks: {
                display: false,
            },
            border: {
                display: false,
            },
        },
    },
};

const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

let rankColor = ["#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#e6f5bf", "#cfdffc"];

export const data = {
    labels,
    datasets: [
        {
            label: 'Data 1',
            data: [0, 0, 0, 0, 1, 0, 5, 2, 3, 8, 5, 21],
            backgroundColor: rankColor,
            borderColor: rankColor,
            hoverBackgroundColor: rankColor,
            hoverBorderColor: rankColor,
        },
    ],
};

export default function BarChart() {
    return (
        <div className='contentWrap'>
            <div className='contentInner'>
                <Bar 
                    options={options} 
                    data={data} 
                    height={70} 
                    plugins={[dataLabelPlugin]} 
                />
            </div>
        </div>
    );
}