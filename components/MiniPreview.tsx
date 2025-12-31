import React from 'react';
import { CanvasElement, CanvasSettings } from '../types';
import { ICON_PATHS } from '../constants';

interface MiniPreviewProps {
  elements: CanvasElement[];
  settings: CanvasSettings;
}

const getSparklinePath = (data: number[], width: number, height: number, closeLoop = false) => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    const h = height - 4; 
    let path = 'M ' + data.map((val, i) => {
      const x = i * stepX;
      const y = h - ((val - min) / range) * h + 2; 
      return `${x},${y}`;
    }).join(' L ');
    if (closeLoop) {
        path += ` L ${width},${height} L 0,${height} Z`;
    }
    return path;
};

const MiniPreview: React.FC<MiniPreviewProps> = ({ elements, settings }) => {
  // Constants for scaling based on a standard thumbnail size (e.g., 280px width container)
  const PREVIEW_WIDTH = 280;
  const scale = PREVIEW_WIDTH / settings.width;
  const height = settings.height * scale;

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#f8fafc' // subtle bg for the preview area
      }}
    >
      <div
        style={{
          width: settings.width,
          height: settings.height,
          backgroundColor: settings.backgroundColor,
          borderRadius: settings.borderRadius,
          borderWidth: settings.borderWidth,
          borderColor: settings.borderColor,
          borderStyle: settings.borderStyle || 'solid',
          boxShadow: settings.showShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0
        }}
      >
        {elements.map(el => {
          // Glass effect simulation for preview
          const glassStyle: React.CSSProperties = el.glass?.enabled ? {
            backgroundColor: el.style.backgroundColor, // Simplified for preview
            backdropFilter: `blur(${el.glass.blur}px)`
          } : {};

          return (
            <div
              key={el.id}
              style={{
                ...el.style,
                ...glassStyle,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: el.type === 'text' ? (el.style.textAlign === 'center' ? 'center' : el.style.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'center',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap'
              }}
            >
              {el.type === 'text' && el.content}
              
              {el.type === 'box' && <div style={{width: '100%', height: '100%'}} />}
              
              {el.type === 'icon' && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill={el.style.color?.toString()}>
                  <path d={ICON_PATHS[el.content || 'star'] || ''} />
                </svg>
              )}
              
              {el.type === 'image' && (
                <img src={el.chartProps?.imageUrl} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              )}
              
              {el.type === 'progress-bar' && (
                <div style={{ width: '100%', height: '100%', backgroundColor: el.chartProps?.backgroundColor || '#e2e8f0', borderRadius: el.style.borderRadius }}>
                   <div style={{ width: `${el.chartProps?.value || 0}%`, height: '100%', backgroundColor: el.chartProps?.color || '#3b82f6', borderRadius: el.style.borderRadius }} />
                </div>
              )}

              {el.type === 'circular-progress' && (
                 <div style={{
                     width: '100%', height: '100%', borderRadius: '50%', 
                     border: `${el.chartProps?.strokeWidth || 4}px solid ${el.chartProps?.color || '#3b82f6'}`,
                     opacity: el.name.includes('BG') ? 0.3 : 1 
                 }} />
              )}

              {(el.type === 'sparkline' || el.type === 'area-chart') && (
                 <svg width="100%" height="100%" viewBox={`0 0 ${parseInt(el.style.width?.toString() || '100')} ${parseInt(el.style.height?.toString() || '50')}`} preserveAspectRatio="none">
                    {el.type === 'area-chart' && (
                        <path d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'), true)} fill={el.chartProps?.backgroundColor || '#dbeafe'} stroke="none" />
                    )}
                    <path d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'))} fill="none" stroke={el.chartProps?.color || '#3b82f6'} strokeWidth={el.chartProps?.strokeWidth || 2} />
                 </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniPreview;