'use client'

import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: [
        'Red',
        'Blue',
        'Yellow',
        'Green',
    ],
    datasets: [
        {
            label: '카테고리',
            data: [12, 19, 3, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderWidth: 1
        }
    ]
};

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    
    plugins: {
        legend: {
            position: 'right' as const, 
        },
    },
};

export default function DoughnutChart() {
    return (
        <Doughnut 
            data={data} 
            options={options}
            height={110}
            width={100}
        />
    );
}