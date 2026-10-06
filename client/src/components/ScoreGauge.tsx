/**
 * ScoreGauge - Semicircular gauge for risk score (0-100)
 * Design: Crimson Pulse — animated arc with color based on risk level
 */
import { useEffect, useState } from "react";
import { getRiskColor } from "@/lib/riskEngine";
import type { RiskLevel } from "@/lib/riskEngine";

interface ScoreGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export default function ScoreGauge({ score, level, size = 180 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getRiskColor(level);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * animatedScore) / 100;

  const cx = size / 2;
  const cy = size / 2 + 10;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(135 ${cx} ${cy})`}
        />
        {/* Value arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(135 ${cx} ${cy})`}
          style={{
            transition: "stroke-dashoffset 0.4s ease",
            filter: `drop-shadow(0 0 8px ${color}66)`,
          }}
        />
        {/* Score value */}
        <text x={cx} y={cy - 2} fill="#FFFFFF" fontSize="42" fontWeight="700" textAnchor="middle" fontFamily="DM Sans">
          {animatedScore}
        </text>
        <text x={cx} y={cy + 18} fill="rgba(255,255,255,0.4)" fontSize="14" textAnchor="middle" fontFamily="DM Sans">
          /100
        </text>
      </svg>
      <div
        className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold font-display"
        style={{
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        {level} RISK
      </div>
    </div>
  );
}
