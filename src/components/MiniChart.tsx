import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

export function MiniChart({ symbol, color }: { symbol: string, color: string }) {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chart?symbol=${symbol}`);
        if (res.ok) {
          const data = await res.json();
          setPoints(data.prices || []);
        }
      } catch (e) {
        console.error('Failed to fetch mini chart', e);
      }
    };
    fetchChart();
  }, [symbol]);

  if (points.length < 2) return <span className="inline-block w-16 h-4 opacity-30 text-[10px] ml-2 text-ide-text-muted">[차트 로딩]</span>;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1; // avoid divide by zero

  const width = 60;
  const height = 15;

  const pathData = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block ml-4 overflow-visible" style={{ verticalAlign: 'middle', marginTop: '-3px' }}>
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-fade-in"
      />
    </svg>
  );
}
