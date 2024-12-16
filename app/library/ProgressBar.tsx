"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ProgressBar() {

    const percentage = 63;

    return (
        <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
                strokeLinecap: 'round',
                textSize: '26px',
                pathColor: '#d9c2ff',
                textColor: '#f75e5e',
                trailColor: '#f0f0f0',
            })}
        />
    )
}