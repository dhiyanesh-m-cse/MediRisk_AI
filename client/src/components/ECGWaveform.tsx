/**
 * ECGWaveform - Animated ECG heartbeat waveform
 * Design: Crimson Pulse — continuous animated heartbeat line on dark background
 */
import { useEffect, useRef } from "react";

interface ECGWaveformProps {
  width?: number;
  height?: number;
  color?: string;
  animated?: boolean;
  heartRate?: number;
  label?: string;
  timestamp?: string;
}

export default function ECGWaveform({
  width = 300,
  height = 80,
  color = "#DC2626",
  animated = true,
  heartRate = 70,
  label,
  timestamp,
}: ECGWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const speed = heartRate * 0.03;

    function drawWaveform() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const cycleLength = width / (heartRate / 20);
      const offset = offsetRef.current;

      for (let x = 0; x < width; x++) {
        const t = ((x + offset) % cycleLength) / cycleLength;
        let y = height / 2;

        // P wave (small bump before QRS)
        if (t > 0.15 && t < 0.25) {
          const pt = (t - 0.15) / 0.1;
          y -= 4 * Math.sin(pt * Math.PI);
        }
        // Q wave
        else if (t > 0.30 && t < 0.35) {
          const qt = (t - 0.30) / 0.05;
          y += 5 * Math.sin(qt * Math.PI);
        }
        // R wave (tall spike)
        else if (t > 0.33 && t < 0.42) {
          const rt = (t - 0.33) / 0.09;
          y -= 30 * Math.sin(rt * Math.PI);
        }
        // S wave
        else if (t > 0.42 && t < 0.48) {
          const st = (t - 0.42) / 0.06;
          y += 8 * Math.sin(st * Math.PI);
        }
        // T wave
        else if (t > 0.55 && t < 0.70) {
          const tt = (t - 0.55) / 0.15;
          y -= 8 * Math.sin(tt * Math.PI);
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      offsetRef.current += speed;
    }

    if (animated) {
      const animate = () => {
        drawWaveform();
        animRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawWaveform();
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [width, height, color, animated, heartRate]);

  return (
    <div className="flex flex-col">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white/60 font-body">{label}</span>
          {timestamp && (
            <span className="text-xs text-white/40">{timestamp}</span>
          )}
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="w-full"
      />
    </div>
  );
}
