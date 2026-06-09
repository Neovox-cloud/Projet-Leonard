'use client';

import React, { useState } from 'react';
import { CompartmentHistoryEntry } from '../hooks/useSimulationCave';

interface HistoryChartProps {
  history: CompartmentHistoryEntry[];
}

export default function HistoryChart({ history }: HistoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
        Aucune donnée historique disponible
      </div>
    );
  }

  // Dimensions
  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Temperature scales
  const tempValues = history.map(h => h.temp);
  const minTemp = Math.min(...tempValues) - 1.5;
  const maxTemp = Math.max(...tempValues) + 1.5;
  const tempRange = maxTemp - minTemp || 1;

  // Humidity scales
  const hygroValues = history.map(h => h.humidity);
  const minHygro = Math.max(0, Math.min(...hygroValues) - 5);
  const maxHygro = Math.min(100, Math.max(...hygroValues) + 5);
  const hygroRange = maxHygro - minHygro || 1;

  // Generate SVG coordinates
  const points = history.map((d, i) => {
    const x = paddingLeft + (i / (history.length - 1 || 1)) * chartWidth;
    const yTemp = paddingTop + chartHeight - ((d.temp - minTemp) / tempRange) * chartHeight;
    const yHygro = paddingTop + chartHeight - ((d.humidity - minHygro) / hygroRange) * chartHeight;
    return { x, yTemp, yHygro, data: d };
  });

  // Create path strings
  const tempPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTemp}`).join(' ');
  const hygroPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yHygro}`).join(' ');

  // Create area path strings for gradient fills
  const tempAreaPath = points.length > 0 
    ? `${tempPath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const hygroAreaPath = points.length > 0 
    ? `${hygroPath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 transition-colors">
      <div className="flex justify-between items-center mb-4 text-[11px] font-bold tracking-wider uppercase">
        <span className="text-slate-500 dark:text-slate-450">Historique temps réel</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Temp (°C)
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-500">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Hygro (%)
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            {/* Gradients */}
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="hygroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines & Axes labels */}
          <g className="stroke-slate-200/80 dark:stroke-slate-800/80 font-mono text-[9px] fill-slate-400 dark:fill-slate-500" strokeWidth="1">
            {/* Temp boundaries */}
            <text x="5" y={paddingTop + 4} stroke="none">{maxTemp.toFixed(1)}°</text>
            <text x="5" y={paddingTop + chartHeight + 3} stroke="none">{minTemp.toFixed(1)}°</text>
            
            {/* Hygro boundaries on the right */}
            <text x={width - 25} y={paddingTop + 4} stroke="none" textAnchor="end">{maxHygro.toFixed(0)}%</text>
            <text x={width - 25} y={paddingTop + chartHeight + 3} stroke="none" textAnchor="end">{minHygro.toFixed(0)}%</text>

            {/* Horizontal lines */}
            <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} />
            <line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} strokeDasharray="3 3" />
            <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} />
          </g>

          {/* Time axis */}
          <g className="font-mono text-[8px] fill-slate-400 dark:fill-slate-500" textAnchor="middle">
            {points.length > 1 && (
              <>
                <text x={points[0].x} y={height - 5}>{points[0].data.time.split(' ')[0]}</text>
                <text x={points[Math.floor(points.length / 2)].x} y={height - 5}>{points[Math.floor(points.length / 2)].data.time.split(' ')[0]}</text>
                <text x={points[points.length - 1].x} y={height - 5}>{points[points.length - 1].data.time.split(' ')[0]}</text>
              </>
            )}
          </g>

          {/* Area under curve */}
          {tempAreaPath && <path d={tempAreaPath} fill="url(#tempGrad)" />}
          {hygroAreaPath && <path d={hygroAreaPath} fill="url(#hygroGrad)" />}

          {/* Lines */}
          <path d={tempPath} fill="none" className="stroke-amber-500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={hygroPath} fill="none" className="stroke-blue-500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interaction overlays & Hover lines */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - chartWidth / (history.length * 2)}
              y={paddingTop}
              width={chartWidth / (history.length - 1 || 1)}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* Hover indicator lines and dots */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <line 
                x1={points[hoveredIndex].x} 
                y1={paddingTop} 
                x2={points[hoveredIndex].x} 
                y2={paddingTop + chartHeight} 
                className="stroke-slate-350 dark:stroke-slate-700" 
                strokeWidth="1.2" 
                strokeDasharray="2 2" 
              />
              
              {/* Temp Dot */}
              <circle cx={points[hoveredIndex].x} cy={points[hoveredIndex].yTemp} r="4.5" className="fill-amber-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
              {/* Hygro Dot */}
              <circle cx={points[hoveredIndex].x} cy={points[hoveredIndex].yHygro} r="4.5" className="fill-blue-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Live dynamic tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div 
            className="absolute z-10 bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700 text-white rounded-lg p-2 shadow-xl text-[10px] pointer-events-none space-y-0.5 flex flex-col font-mono"
            style={{
              left: `${Math.min(80, Math.max(5, (hoveredIndex / history.length) * 100))}%`,
              top: '-15px'
            }}
          >
            <span className="text-slate-400 border-b border-slate-800 pb-0.5 mb-0.5">{points[hoveredIndex].data.time}</span>
            <span className="text-amber-400 font-bold">Temp: {points[hoveredIndex].data.temp.toFixed(1)}°C</span>
            <span className="text-blue-400 font-bold">Hygro: {points[hoveredIndex].data.humidity.toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
