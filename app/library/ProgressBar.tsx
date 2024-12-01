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
                pathColor: '#d5abff',
                textColor: '#f84a4a',
                trailColor: '#f0f0f0',
            })}
        />
    )
}