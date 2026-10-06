/**
 * HeartRateGauge - Semicircular gauge for displaying heart rate
 * Design: Crimson Pulse — animated crimson arc with centered BPM value
 */
import { useEffect, useState } from "react";

interface HeartRateGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
}

export default function HeartRateGauge({
  value,
  min = 0,
  max = 120,
  label = "Electrocardiogram",
  unit = "bpm",
  size = 200,
}: HeartRateGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * eased;
      setAnimatedValue(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const percentage = ((animatedValue - min) / (max - min)) * 100;
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  const cx = size / 2;
  const cy = size / 2 + 10;

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium text-white/50 mb-3 font-body">
        {label}
      </div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={8}
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
          stroke="url(#gaugeGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(135 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        {/* Min/Max labels */}
        <text x={cx - radius - 12} y={cy + radius + 8} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" fontFamily="DM Sans">
          {min}
        </text>
        <text x={cx + radius + 12} y={cy + radius + 8} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="middle" fontFamily="DM Sans">
          {max}+
        </text>
        {/* Center value */}
        <text x={cx} y={cy + 5} fill="#FFFFFF" fontSize="36" fontWeight="700" textAnchor="middle" fontFamily="DM Sans">
          {animatedValue}
        </text>
        <text x={cx} y={cy + 22} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" fontFamily="DM Sans">
          {unit}
        </text>
      </svg>
    </div>
  );
}
