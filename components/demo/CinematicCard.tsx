import React from 'react';
import { CanvasElement, CanvasSettings } from '../../types';
import { ICON_PATHS } from '../../constants';

interface CinematicCardProps {
    elements: CanvasElement[];
    settings: CanvasSettings;
    mouseX: number;
    mouseY: number;
    containerWidth: number;
    containerHeight: number;
    isExploded?: boolean;
    accentColor: string;
    scale?: number;
    inEditorMode?: boolean;
    textOverrides?: Record<string, string>;
}

export const CinematicCard: React.FC<CinematicCardProps> = ({ 
    elements, 
    settings, 
    accentColor,
    isExploded = false,
    scale = 1,
    textOverrides
}) => {
    
    const getPath = (data: number[], width: number, height: number, closeLoop: boolean) => {
        if (!data || data.length === 0) return '';
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const stepX = width / (data.length - 1 || 1);
        const h = height - 4;
        const points = data.map((val, i) => {
            const x = i * stepX;
            const y = h - ((val - min) / range) * h + 2; 
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        
        let path = `M ${points.join(' L ')}`;
        if (closeLoop) {
            path += ` L ${width},${height} L 0,${height} Z`;
        }
        return path;
    };

    const getDepth = (el: CanvasElement, index: number) => {
        if (!isExploded) return 0;
        let base = index * 15;
        if (el.type === 'box') base = 10;
        if (el.type === 'area-chart' || el.type === 'sparkline') base = 40;
        if (el.type === 'text') base = 60;
        if (el.type === 'icon') base = 80;
        if (el.name.includes('Badge')) base = 90;
        return base;
    };

    return (
        <div 
            className="relative transition-transform duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)"
            style={{ 
                 transform: `scale(${scale}) rotateX(${isExploded ? '40deg' : '0deg'}) rotateY(${isExploded ? '-15deg' : '0deg'})`,
                 transformStyle: 'preserve-3d',
                 perspective: '1000px'
             }}
        >
            {/* Base Card Layer */}
            <div 
                style={{
                    width: settings.width,
                    height: settings.height,
                    backgroundColor: '#ffffff',
                    borderRadius: settings.borderRadius,
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: isExploded 
                        ? '0 50px 50px -20px rgba(0,0,0,0.3)' 
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    position: 'absolute',
                    transform: 'translateZ(0)',
                    transition: 'all 1s ease'
                }}
            />

            {/* Elements Layer */}
            <div style={{
                width: settings.width,
                height: settings.height,
                position: 'relative',
                transformStyle: 'preserve-3d'
            }}>
                 {elements.map((el, i) => {
                    // COLOR SWAPPING LOGIC
                    // Updated to include the new template's specific shades of green
                    const isPrimaryColor = 
                        el.style.color === '#15803d' || 
                        el.style.color === '#059669' || 
                        el.style.color === '#16a34a' || // New Template Icon Color
                        el.chartProps?.color === '#10b981';
                    
                    const isBgColor = 
                        el.chartProps?.backgroundColor === '#d1fae5' || 
                        el.style.backgroundColor === '#ecfdf5' ||
                        el.style.backgroundColor === '#f0fdf4';

                    const finalColor = isPrimaryColor ? accentColor : el.style.color;
                    
                    let finalBg = el.style.backgroundColor;
                    if (isBgColor && accentColor) {
                        finalBg = accentColor + '20'; 
                    }
                    
                    const chartColor = isPrimaryColor ? accentColor : el.chartProps?.color;
                    const chartBg = isBgColor ? accentColor + '30' : el.chartProps?.backgroundColor;

                    const depth = getDepth(el, i);

                    const content = (textOverrides && textOverrides[el.id]) ? textOverrides[el.id] : el.content;

                    return (
                        <div 
                            key={el.id}
                            style={{
                                position: 'absolute',
                                left: el.style.left,
                                top: el.style.top,
                                width: el.style.width,
                                height: el.style.height,
                                color: finalColor,
                                fontSize: el.style.fontSize,
                                fontWeight: el.style.fontWeight,
                                backgroundColor: finalBg,
                                borderRadius: el.style.borderRadius,
                                border: (typeof el.style.border === 'string') ? el.style.border.replace('#d1fae5', accentColor + '40') : el.style.border,
                                zIndex: el.style.zIndex,
                                display: el.style.display || (el.type === 'text' ? 'block' : 'flex'),
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxSizing: 'border-box',
                                transform: `translateZ(${depth}px)`,
                                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                textShadow: isExploded && el.type === 'text' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                             {el.type === 'text' && (
                                 <span style={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', width: '100%' }}>{content}</span>
                             )}
                             
                             {el.type === 'icon' && (
                                 <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ fill: finalColor, transition: 'fill 0.5s ease' }}>
                                    <path d={ICON_PATHS[content || 'star'] || ''} />
                                 </svg>
                             )}
                             
                             {(el.type === 'area-chart' || el.type === 'sparkline') && (
                                <svg width="100%" height="100%" viewBox={`0 0 ${el.style.width} ${el.style.height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                    {el.type === 'area-chart' && (
                                        <path 
                                            d={getPath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString()||'0'), parseInt(el.style.height?.toString()||'0'), true)} 
                                            fill={chartColor} 
                                            fillOpacity="0.2"
                                            style={{ transition: 'fill 0.5s ease' }}
                                        />
                                    )}
                                    <path 
                                        d={getPath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString()||'0'), parseInt(el.style.height?.toString()||'0'), false)} 
                                        fill="none" 
                                        stroke={chartColor} 
                                        strokeWidth={el.chartProps?.strokeWidth || 2} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        style={{ transition: 'stroke 0.5s ease' }}
                                    />
                                </svg>
                            )}
                            
                            {isExploded && depth > 0 && (
                                <div 
                                    style={{
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        width: '1px', height: `${depth}px`,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0))',
                                        transform: `rotateX(-90deg) translateZ(-${depth/2}px)`,
                                        transformOrigin: 'top center',
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
                
                {!isExploded && (
                    <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none z-50"
                        style={{
                            background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%)',
                            backgroundSize: '200% 100%',
                            animation: 'glare-pass 3s infinite linear',
                            mixBlendMode: 'overlay',
                            opacity: 0.3
                        }}
                    />
                )}
            </div>
            
            <style>{`
                @keyframes glare-pass {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>
        </div>
    );
};