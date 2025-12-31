import React from 'react';
import { CanvasElement, CanvasSettings, AnimationEasing, AnimationConfig } from '../types';
import { ICON_PATHS } from '../constants';

interface MiniPreviewProps {
  elements: CanvasElement[];
  settings: CanvasSettings;
}

// --- ANIMATION HELPERS (Duplicated to be self-contained for previews) ---
const getBezier = (easing: AnimationEasing): string => {
    switch (easing) {
        case 'elastic': return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        case 'bounce-out': return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        case 'ease-out': return 'ease-out';
        case 'ease-in-out': return 'ease-in-out';
        case 'linear': return 'linear';
        default: return 'ease';
    }
};

const KEYFRAME_DEFINITIONS: Record<string, string> = {
    'fade-entry': '@keyframes fade-entry { from { opacity: 0; } to { opacity: 1; } }',
    'slide-up-entry': '@keyframes slide-up-entry { from { opacity: 0; transform: translateY(var(--enter-dist, 20px)); } to { opacity: 1; transform: translateY(0); } }',
    'slide-down-entry': '@keyframes slide-down-entry { from { opacity: 0; transform: translateY(calc(var(--enter-dist, 20px) * -1)); } to { opacity: 1; transform: translateY(0); } }',
    'slide-left-entry': '@keyframes slide-left-entry { from { opacity: 0; transform: translateX(var(--enter-dist, 20px)); } to { opacity: 1; transform: translateX(0); } }',
    'slide-right-entry': '@keyframes slide-right-entry { from { opacity: 0; transform: translateX(calc(var(--enter-dist, 20px) * -1)); } to { opacity: 1; transform: translateX(0); } }',
    'scale-entry': '@keyframes scale-entry { from { opacity: 0; transform: scale(var(--enter-scale, 0.5)); } to { opacity: 1; transform: scale(1); } }',
    'bounce-entry': '@keyframes bounce-entry { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }',
    'spin-entry': '@keyframes spin-entry { from { opacity: 0; transform: rotate(var(--enter-deg, -180deg)) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }',
    'float-idle': '@keyframes float-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(var(--idle-float-y, -10px)); } }',
    'breathing-idle': '@keyframes breathing-idle { 0%, 100% { transform: scale(1); } 50% { transform: scale(var(--idle-scale-max, 1.05)); } }',
    'heartbeat-idle': '@keyframes heartbeat-idle { 0% { transform: scale(1); } 14% { transform: scale(var(--idle-scale-max, 1.1)); } 28% { transform: scale(1); } 42% { transform: scale(var(--idle-scale-max, 1.1)); } 70% { transform: scale(1); } }',
    'shimmer-idle': '@keyframes shimmer-idle { 0%, 100% { filter: brightness(100%) opacity(1); } 50% { filter: brightness(var(--idle-brightness, 150%)) opacity(0.8); } }',
    'shake-idle': '@keyframes shake-idle { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(calc(var(--idle-shake-x, 5px) * -1)); } 20%, 40%, 60%, 80% { transform: translateX(var(--idle-shake-x, 5px)); } }',
    'wiggle-idle': '@keyframes wiggle-idle { 0%, 100% { transform: rotate(calc(var(--idle-rotate, 5deg) * -1)); } 50% { transform: rotate(var(--idle-rotate, 5deg)); } }',
    'spin-idle': '@keyframes spin-idle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
    'pulse-idle': '@keyframes pulse-idle { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }'
};

const getAnimationVars = (config: AnimationConfig | undefined, prefix: 'enter' | 'idle'): React.CSSProperties => {
    if (!config || config.type === 'none') return {};
    const i = config.intensity ?? 50;
    const ratio = i / 50;
    const vars: any = {};
    if (prefix === 'enter') {
        vars['--enter-dist'] = `${Math.max(5, 20 * ratio)}px`;
        vars['--enter-scale'] = Math.max(0, 1 - (0.5 * ratio));
        vars['--enter-deg'] = `${-180 * ratio}deg`;
    } else {
        vars['--idle-float-y'] = `${-8 * ratio}px`;
        vars['--idle-scale-max'] = 1 + (0.1 * ratio);
        vars['--idle-scale-min'] = 1 - (0.05 * ratio);
        vars['--idle-shake-x'] = `${5 * ratio}px`;
        vars['--idle-rotate'] = `${5 * ratio}deg`;
        vars['--idle-brightness'] = 1 + (0.5 * ratio);
    }
    return vars;
};

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
  // Constants for scaling based on a standard thumbnail size
  const PREVIEW_WIDTH = 280;
  const scale = PREVIEW_WIDTH / settings.width;

  // Generate CSS for animations used in this preview
  const generateStyles = () => {
      const usedKeys = new Set<string>();
      let elementStyles = '';
      
      elements.forEach(el => {
          if(!el.animation) return;
          const { entry, idle } = el.animation;
          let animations = [];

          if(entry && entry.type !== 'none') {
             usedKeys.add(`${entry.type}-entry`);
             animations.push(`${entry.type}-entry ${entry.duration}s ${getBezier(entry.easing)} ${entry.delay}s forwards`);
          } 
          if(idle && idle.type !== 'none') {
             usedKeys.add(`${idle.type}-idle`);
             const entryDuration = (entry && entry.type !== 'none') ? (entry.duration + entry.delay) : 0;
             const idleDelay = idle.delay + entryDuration;
             animations.push(`${idle.type}-idle ${idle.duration}s ${getBezier(idle.easing)} ${idleDelay}s infinite`);
          }
          if (animations.length > 0) {
              const baseOpacity = (entry && entry.type !== 'none') ? 'opacity: 0;' : '';
              elementStyles += `.mini-el-${el.id} { animation: ${animations.join(', ')}; ${baseOpacity} }`;
          }
      });

      const keyframes = Array.from(usedKeys).map(key => KEYFRAME_DEFINITIONS[key] || '').join('\n');
      return keyframes + elementStyles;
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#f8fafc' 
      }}
    >
      <style>{generateStyles()}</style>
      <div
        style={{
          width: settings.width,
          height: settings.height,
          backgroundColor: settings.backgroundColor,
          // FIX: Add Gradient support
          background: (settings as any).background || settings.backgroundColor,
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
          const glassStyle: React.CSSProperties = el.glass?.enabled ? {
            backgroundColor: el.style.backgroundColor, 
            backdropFilter: `blur(${el.glass.blur}px)`
          } : {};

          // Inject animation vars
          const entryVars = getAnimationVars(el.animation?.entry, 'enter');
          const idleVars = getAnimationVars(el.animation?.idle, 'idle');
          
          // FIX: Element Gradient Support Logic (Box/Background)
          const bgStyle: any = {};
          if ((el.style as any).background) {
              bgStyle.background = (el.style as any).background;
              bgStyle.backgroundColor = 'transparent'; 
          }

          // Check for Foreground Text Gradient Logic
          const isTextGradient = (el.style as any).WebkitBackgroundClip === 'text';

          return (
            <div
              key={el.id}
              className={`mini-el-${el.id}`} // Hook for animation CSS
              style={{
                ...el.style,
                ...glassStyle,
                ...entryVars,
                ...idleVars,
                ...bgStyle,
                // Remove bg props from container if it's text gradient to prevent clipping issues
                ...(isTextGradient ? { background: 'transparent', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' } : {}),
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: el.type === 'text' ? (el.style.textAlign === 'center' ? 'center' : el.style.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'center',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap'
              }}
            >
              {el.type === 'text' && (
                  isTextGradient ? (
                      <span style={{ 
                          backgroundImage: (el.style as any).backgroundImage,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                      }}>
                          {el.content}
                      </span>
                  ) : el.content
              )}
              
              {el.type === 'box' && <div style={{width: '100%', height: '100%'}} />}
              
              {el.type === 'icon' && (
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    // Handle Icon Gradient using Mask logic if active
                    ...(isTextGradient ? {
                        background: (el.style as any).backgroundImage,
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${ICON_PATHS[el.content || 'star'] || ''}'/%3E%3C/svg%3E")`,
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        WebkitMaskSize: 'contain'
                    } : {})
                }}>
                    {ICON_PATHS[el.content || ''] ? (
                        !isTextGradient && (
                            <svg viewBox="0 0 24 24" width="100%" height="100%" fill={el.style.color?.toString()}>
                              <path d={ICON_PATHS[el.content || 'star'] || ''} />
                            </svg>
                        )
                    ) : (
                        <span 
                            className="material-symbols-outlined"
                            style={{ 
                                fontSize: el.style.fontSize,
                                color: isTextGradient ? 'transparent' : el.style.color,
                                // Scale down slightly in preview to match SVG sizing feel
                                transform: 'scale(0.8)',
                                ...(isTextGradient ? {
                                    backgroundImage: (el.style as any).backgroundImage,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                } : {})
                            }}
                        >
                            {el.content}
                        </span>
                    )}
                </div>
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
                 <div style={{ width: '100%', height: '100%' }}>
                    {(() => {
                        const size = parseInt(el.style.width?.toString() || '80');
                        const strokeWidth = el.chartProps?.strokeWidth || 8;
                        const radius = (size - strokeWidth) / 2;
                        const circumference = 2 * Math.PI * radius;
                        const value = Math.min(Math.max(el.chartProps?.value || 0, 0), 100);
                        const offset = circumference - (value / 100) * circumference;
                        const center = size / 2;

                        return (
                            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                                <circle 
                                    cx={center} 
                                    cy={center} 
                                    r={radius} 
                                    fill="none" 
                                    stroke={el.chartProps?.backgroundColor || '#e2e8f0'} 
                                    strokeWidth={strokeWidth} 
                                />
                                <circle 
                                    cx={center} 
                                    cy={center} 
                                    r={radius} 
                                    fill="none" 
                                    stroke={el.chartProps?.color || '#3b82f6'} 
                                    strokeWidth={strokeWidth} 
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                />
                            </svg>
                        );
                    })()}
                 </div>
              )}

              {el.type === 'table' && el.tableProps && (
                  <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: el.style.borderRadius }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                          <thead>
                              <tr style={{ backgroundColor: el.tableProps.headerBgColor }}>
                                  {el.tableProps.columns.map(col => (
                                      <th key={col.id} style={{ width: `${col.width}%`, height: 4, backgroundColor: el.tableProps?.headerBgColor }}></th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody>
                              {[1, 2].map(r => (
                                  <tr key={r} style={{ borderBottom: `1px solid ${el.tableProps?.gridColor}`, height: 8 }}>
                                       {el.tableProps?.columns.map(col => (
                                          <td key={col.id} style={{ backgroundColor: el.tableProps?.rowBgColor }}></td>
                                       ))}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
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