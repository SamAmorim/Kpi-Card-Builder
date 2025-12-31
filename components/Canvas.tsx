import React, { useRef, useState, useEffect } from 'react';
import { CanvasElement, CanvasSettings, AnimationEasing, AnimationConfig } from '../types';
import { ICON_PATHS } from '../constants';

type ResizeDirection = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';
type InteractionMode = 'cursor' | 'hand';

interface CanvasProps {
  elements: CanvasElement[];
  settings: CanvasSettings;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onInteractionStart?: () => void; // New prop for history
  emptyStateText: { title: string, desc: string };
  animationTrigger?: number;
}

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  settings, 
  selectedId, 
  onSelect,
  onUpdate,
  onDelete,
  onInteractionStart,
  emptyStateText,
  animationTrigger = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport State
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('cursor');

  // Element State
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, left: 0, top: 0 });
  
  // Resize State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDirection | null>(null);
  const [initialResize, setInitialResize] = useState({ x: 0, y: 0, w: 0, h: 0, left: 0, top: 0 });
  
  // Rotation State
  const [isRotating, setIsRotating] = useState(false);
  const [initialRotation, setInitialRotation] = useState({ x: 0, y: 0, angle: 0, startRotation: 0 });

  const [editingId, setEditingId] = useState<string | null>(null);

  // --- ZOOM & PAN LOGIC ---
  const handleZoom = (delta: number) => {
      setScale(prev => Math.min(Math.max(0.1, prev + delta), 4));
  };

  const handleResetView = () => {
      setScale(1);
      setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.ctrlKey || e.metaKey) {
            const delta = -e.deltaY * 0.001;
            setScale(prev => Math.min(Math.max(0.1, prev + delta), 4));
        } else {
            setOffset(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- HELPER: GET ROTATION ---
  const getRotationAngle = (transform: string | undefined): number => {
    if (!transform) return 0;
    const match = transform.match(/rotate\(([-]?\d+)deg\)/);
    return match ? parseInt(match[1]) : 0;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return hex;
  };

  // --- MOUSE EVENT HANDLERS ---
  const handleResizeStart = (e: React.MouseEvent, dir: ResizeDirection) => {
      e.stopPropagation();
      e.preventDefault();
      onInteractionStart?.(); // Capture history state before change
      
      const el = elements.find(el => el.id === selectedId);
      if (!el) return;
      const elementNode = document.getElementById(`element-${selectedId}`);
      let currentW = el.style.width ? parseInt(el.style.width.toString()) : 0;
      let currentH = el.style.height ? parseInt(el.style.height.toString()) : 0;
      if (currentW === 0 && elementNode) currentW = elementNode.offsetWidth;
      if (currentH === 0 && elementNode) currentH = elementNode.offsetHeight;
      setIsResizing(true);
      setResizeDir(dir);
      setInitialResize({ x: e.clientX, y: e.clientY, w: currentW, h: currentH, left: parseInt(el.style.left?.toString() || '0'), top: parseInt(el.style.top?.toString() || '0') });
  };
  const handleRotateStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onInteractionStart?.(); // Capture history state before change

      const el = elements.find(el => el.id === selectedId);
      if (!el) return;
      const elementNode = document.getElementById(`element-${selectedId}`);
      if (!elementNode) return;
      const box = elementNode.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      setIsRotating(true);
      setInitialRotation({ x: centerX, y: centerY, angle: Math.atan2(e.clientY - centerY, e.clientX - centerX), startRotation: getRotationAngle(el.style.transform?.toString()) });
  };
  const handleGlobalMouseMove = (e: MouseEvent) => {
      const snap = e.ctrlKey ? 1 : 5;
      if (isPanning) { setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY })); return; }
      if (isRotating && selectedId) {
          const currentAngle = Math.atan2(e.clientY - initialRotation.y, e.clientX - initialRotation.x);
          let deg = initialRotation.startRotation + (currentAngle - initialRotation.angle) * (180 / Math.PI);
          if (e.shiftKey) deg = Math.round(deg / 15) * 15;
          onUpdate(selectedId, { style: { ...elements.find(el => el.id === selectedId)?.style, transform: `rotate(${Math.round(deg)}deg)` } });
          return;
      }
      if (isResizing && selectedId && resizeDir) {
           const totalDeltaX = (e.clientX - initialResize.x) / scale;
           const totalDeltaY = (e.clientY - initialResize.y) / scale;
           const newStyle: any = {};
           if (resizeDir.includes('e')) newStyle.width = Math.max(10, Math.round((initialResize.w + totalDeltaX) / snap) * snap);
           if (resizeDir.includes('w')) {
             const potentialWidth = initialResize.w - totalDeltaX;
             if (potentialWidth > 10) { newStyle.width = Math.max(10, Math.round(potentialWidth / snap) * snap); newStyle.left = Math.round((initialResize.left + totalDeltaX) / snap) * snap; }
           }
           if (resizeDir.includes('s')) newStyle.height = Math.max(10, Math.round((initialResize.h + totalDeltaY) / snap) * snap);
           if (resizeDir.includes('n')) {
              const potentialHeight = initialResize.h - totalDeltaY;
              if (potentialHeight > 10) { newStyle.height = Math.max(10, Math.round(potentialHeight / snap) * snap); newStyle.top = Math.round((initialResize.top + totalDeltaY) / snap) * snap; }
           }
           onUpdate(selectedId, { style: { ...elements.find(el => el.id === selectedId)?.style, ...newStyle } });
           return;
      }
      if (isDraggingElement && selectedId && interactionMode === 'cursor') {
          if (isResizing) return;
          const el = elements.find(el => el.id === selectedId);
          if (el) {
              const dx = (e.clientX - dragStart.x) / scale;
              const dy = (e.clientY - dragStart.y) / scale;
              let newLeft = dragStart.left + dx;
              let newTop = dragStart.top + dy;
              newLeft = Math.round(newLeft / snap) * snap;
              newTop = Math.round(newTop / snap) * snap;
              onUpdate(selectedId, { style: { ...el.style, left: newLeft, top: newTop } });
          }
      }
  };
  const handleGlobalMouseUp = () => { setIsDraggingElement(false); setIsResizing(false); setIsRotating(false); setIsPanning(false); setResizeDir(null); };
  useEffect(() => { window.addEventListener('mousemove', handleGlobalMouseMove); window.addEventListener('mouseup', handleGlobalMouseUp); return () => { window.removeEventListener('mousemove', handleGlobalMouseMove); window.removeEventListener('mouseup', handleGlobalMouseUp); }; }, [isDraggingElement, isResizing, isRotating, isPanning, selectedId, scale, initialResize, resizeDir, interactionMode, dragStart, initialRotation]);
  
  const handleElementMouseDown = (e: React.MouseEvent, id: string) => { 
      if (isResizing || isRotating) return; 
      e.stopPropagation(); 
      e.preventDefault(); 
      if (interactionMode === 'hand') { setIsPanning(true); return; } 
      if (editingId === id) return; 
      
      const el = elements.find(item => item.id === id); 
      if (!el) return; 
      
      onSelect(id); 
      // Trigger history save on drag start
      onInteractionStart?.();
      
      setIsDraggingElement(true); 
      setDragStart({ x: e.clientX, y: e.clientY, left: parseInt(el.style.left?.toString() || '0'), top: parseInt(el.style.top?.toString() || '0') }); 
  };
  
  const handleBackgroundMouseDown = (e: React.MouseEvent) => { if (e.button === 0) { if (interactionMode === 'hand') { setIsPanning(true); } else { onSelect(null); setEditingId(null); } } if (e.button === 1) { setIsPanning(true); } };

  // --- RENDERING HELPERS ---

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

  // REFINED KEYFRAMES FOR IDLE
  const KEYFRAME_DEFINITIONS: Record<string, string> = {
    // --- ENTRY ---
    'fade-entry': '@keyframes fade-entry { from { opacity: 0; } to { opacity: 1; } }',
    
    'slide-up-entry': '@keyframes slide-up-entry { from { opacity: 0; transform: translateY(var(--enter-dist, 20px)); } to { opacity: 1; transform: translateY(0); } }',
    
    'slide-down-entry': '@keyframes slide-down-entry { from { opacity: 0; transform: translateY(calc(var(--enter-dist, 20px) * -1)); } to { opacity: 1; transform: translateY(0); } }',
    
    'slide-left-entry': '@keyframes slide-left-entry { from { opacity: 0; transform: translateX(var(--enter-dist, 20px)); } to { opacity: 1; transform: translateX(0); } }',
    
    'slide-right-entry': '@keyframes slide-right-entry { from { opacity: 0; transform: translateX(calc(var(--enter-dist, 20px) * -1)); } to { opacity: 1; transform: translateX(0); } }',
    
    'scale-entry': '@keyframes scale-entry { from { opacity: 0; transform: scale(var(--enter-scale, 0.5)); } to { opacity: 1; transform: scale(1); } }',
    
    'bounce-entry': '@keyframes bounce-entry { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }',
    
    'spin-entry': '@keyframes spin-entry { from { opacity: 0; transform: rotate(var(--enter-deg, -180deg)) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }',
    
    // --- IDLE ---
    
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

  const generatePreviewStyles = () => {
      const usedKeys = new Set<string>();
      let styles = '';
      
      elements.forEach(el => {
          if(!el.animation) return;
          const { entry, idle, hover } = el.animation;
          
          let animationString = '';
          const animations = [];

          if(entry && entry.type !== 'none') {
             usedKeys.add(`${entry.type}-entry`);
             animations.push(`${entry.type}-entry ${entry.duration}s ${getBezier(entry.easing)} ${entry.delay}s forwards`);
          } 
          
          if(idle && idle.type !== 'none') {
             usedKeys.add(`${idle.type}-idle`);
             // Calc total delay for idle if entry exists
             const entryDuration = (entry && entry.type !== 'none') ? (entry.duration + entry.delay) : 0;
             const idleDelay = idle.delay + entryDuration;
             animations.push(`${idle.type}-idle ${idle.duration}s ${getBezier(idle.easing)} ${idleDelay}s infinite`);
          }
          
          if (animations.length > 0) {
              // Note: Opacity 0 default only if entry exists
              const baseOpacity = (entry && entry.type !== 'none') ? 'opacity: 0;' : '';
              styles += `.el-${el.id} { animation: ${animations.join(', ')}; ${baseOpacity} }`;
          }

          if(hover && hover.type !== 'none') {
              let transform = '';
              const intensity = (hover.intensity || 50) / 50;
              if (hover.type === 'scale') transform = `scale(${1 + 0.1 * intensity})`;
              if (hover.type === 'slide-up') transform = `translateY(-${5 * intensity}px)`;
              if (hover.type === 'slide-right') transform = `translateX(${5 * intensity}px)`;
              if (hover.type === 'rotate') transform = `rotate(${15 * intensity}deg)`;
              styles += `.el-${el.id}:hover { transform: ${transform} !important; transition: transform ${hover.duration}s ease; }`;
          }
      });

      const keyframes = Array.from(usedKeys).map(key => KEYFRAME_DEFINITIONS[key] || '').join('\n');
      return keyframes + styles;
  };

  const getSparklinePath = (data: number[], width: number, height: number, closeLoop = false) => {
    // ... same code ...
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

  const getHandleStyle = (dir: ResizeDirection) => {
      // ... same code ...
      const base: React.CSSProperties = {
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          border: '1px solid #fff', // blue-600
          zIndex: 50,
          transform: `translate(-50%, -50%) scale(${1/scale})`, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      };
      switch(dir) {
          case 'nw': return { ...base, top: '0%', left: '0%', cursor: 'nw-resize' };
          case 'ne': return { ...base, top: '0%', left: '100%', cursor: 'ne-resize' };
          case 'sw': return { ...base, top: '100%', left: '0%', cursor: 'sw-resize' };
          case 'se': return { ...base, top: '100%', left: '100%', cursor: 'se-resize' };
          case 'n': return { ...base, top: '0%', left: '50%', cursor: 'n-resize' };
          case 's': return { ...base, top: '100%', left: '50%', cursor: 's-resize' };
          case 'w': return { ...base, top: '50%', left: '0%', cursor: 'w-resize' };
          case 'e': return { ...base, top: '50%', left: '100%', cursor: 'e-resize' };
          default: return base;
      }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full h-full overflow-hidden bg-[#e5e5e5] relative select-none" 
      onMouseDown={handleBackgroundMouseDown}
      style={{ 
          cursor: isPanning ? 'grabbing' : interactionMode === 'hand' ? 'grab' : 'default' 
      }}
    >
        <style>{generatePreviewStyles()}</style>

        {/* Light Gray Infinite Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
            style={{ 
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', 
                backgroundSize: `${40 * scale}px ${40 * scale}px`,
                backgroundPosition: `${offset.x}px ${offset.y}px`
            }} 
        />
        
        {/* FLOATING CONTROLS (Updated for high visibility on light bg) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl p-2 flex items-center gap-2 border border-white/10 z-50 animate-in slide-in-from-bottom-6 fade-in duration-500">
            <div className="flex bg-[#222] p-1 rounded-xl mr-2 border border-white/5">
                <button onClick={() => setInteractionMode('cursor')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${interactionMode === 'cursor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Selection Tool (Cursor)"><span className="material-symbols-outlined text-2xl">arrow_selector_tool</span></button>
                <button onClick={() => setInteractionMode('hand')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${interactionMode === 'hand' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Pan Tool (Hand)"><span className="material-symbols-outlined text-2xl">pan_tool</span></button>
            </div>
            <div className="w-px h-10 bg-white/10 mx-1"></div>
            <button onClick={() => handleZoom(-0.1)} className="w-12 h-12 rounded-xl bg-transparent hover:bg-white/10 border border-transparent text-gray-400 hover:text-white flex items-center justify-center transition-all active:scale-95"><span className="material-symbols-outlined text-2xl">remove</span></button>
            <span className="w-16 text-center font-bold text-white font-mono text-lg">{Math.round(scale * 100)}%</span>
            <button onClick={() => handleZoom(0.1)} className="w-12 h-12 rounded-xl bg-transparent hover:bg-white/10 border border-transparent text-gray-400 hover:text-white flex items-center justify-center transition-all active:scale-95"><span className="material-symbols-outlined text-2xl">add</span></button>
            <div className="w-px h-10 bg-white/10 mx-1"></div>
            <button onClick={handleResetView} className="w-12 h-12 rounded-xl bg-transparent hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all" title="Reset View"><span className="material-symbols-outlined text-2xl">center_focus_strong</span></button>
        </div>

      {/* TRANSFORM WRAPPER */}
      <div 
        style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: isPanning ? 'none' : 'auto'
        }}
      >
        <div 
            key={animationTrigger}
            style={{
            width: settings.width,
            height: settings.height,
            backgroundColor: settings.backgroundColor,
            borderRadius: settings.borderRadius,
            borderWidth: settings.borderWidth,
            borderColor: settings.borderColor,
            borderStyle: settings.borderStyle || 'solid',
            boxShadow: settings.showShadow ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : '0 0 0 1px rgba(0,0,0,0.1)',
            position: 'relative',
            // Checkered background for transparency awareness on light canvas
            backgroundImage: settings.backgroundColor === 'transparent' ? 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)' : 'none',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
            className="transition-shadow duration-300"
            onMouseDown={(e) => e.stopPropagation()} 
        >
            {/* Empty State */}
            {elements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 pointer-events-none select-none text-center p-4">
                    <span className="material-symbols-outlined text-6xl mb-2 text-gray-400">drag_click</span>
                    <h3 className="font-bold text-gray-500 text-sm">{emptyStateText.title}</h3>
                    <p className="text-[10px] text-gray-500">{emptyStateText.desc}</p>
                </div>
            )}

            {elements.map(el => {
                const isSelected = selectedId === el.id;
                const isEditing = editingId === el.id;
                const animClass = `el-${el.id}`;
                
                // Get animation vars to inject style
                const entryVars = getAnimationVars(el.animation?.entry, 'enter');
                const idleVars = getAnimationVars(el.animation?.idle, 'idle');
                
                // GLASS EFFECT STYLE OVERRIDE
                const elementStyle = { ...el.style, ...entryVars, ...idleVars };
                if (el.glass?.enabled) {
                    const bg = el.style.backgroundColor?.toString() || '#ffffff';
                    const opacity = (el.glass.opacity || 20) / 100;
                    elementStyle.backgroundColor = hexToRgba(bg, opacity);
                    (elementStyle as any).backdropFilter = `blur(${el.glass.blur}px)`;
                    (elementStyle as any).WebkitBackdropFilter = `blur(${el.glass.blur}px)`;
                }

                return (
                    <div
                    id={`element-${el.id}`}
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (el.type === 'text') setEditingId(el.id);
                    }}
                    style={{
                        ...elementStyle,
                        position: 'absolute',
                        zIndex: el.style.zIndex || 1,
                        userSelect: isEditing ? 'text' : 'none',
                        boxSizing: 'border-box',
                        outline: isSelected && !isEditing ? `2px solid #3b82f6` : 'none',
                    }}
                    className={`group ${animClass} ${interactionMode === 'cursor' ? 'cursor-move hover:outline hover:outline-2 hover:outline-blue-500/50' : 'cursor-grab'}`}
                    >
                    {/* Render Content */}
                    {el.type === 'text' && (
                        isEditing ? (
                            <textarea 
                                autoFocus
                                value={el.content}
                                onChange={(e) => onUpdate(el.id, { content: e.target.value })}
                                onBlur={() => setEditingId(null)}
                                onKeyDown={(e) => e.stopPropagation()} 
                                onMouseDown={(e) => e.stopPropagation()}
                                onWheel={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%', height: '100%', resize: 'none', background: 'transparent',
                                    border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit',
                                    fontWeight: 'inherit', textAlign: el.style.textAlign as any, color: 'inherit',
                                    overflow: 'hidden', lineHeight: el.style.lineHeight, padding: 0, margin: 0,
                                    // Inherit additional text properties for WYSIWYG
                                    letterSpacing: el.style.letterSpacing,
                                    textTransform: el.style.textTransform as any,
                                    textDecoration: el.style.textDecoration,
                                    fontStyle: el.style.fontStyle
                                }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: el.style.textAlign === 'center' ? 'center' : el.style.textAlign === 'right' ? 'flex-end' : 'flex-start', whiteSpace: 'pre-wrap' }}>{el.content}</div>
                        )
                    )}
                    {/* ... other types (box, icon, image, charts) preserved ... */}
                    {el.type === 'box' && <div style={{ width: '100%', height: '100%' }} />}

                    {el.type === 'icon' && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="100%" height="100%" fill={el.style.color?.toString()}><path d={ICON_PATHS[el.content || 'star'] || ''} /></svg>
                        </div>
                    )}

                    {el.type === 'image' && <img src={el.chartProps?.imageUrl || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: el.style.borderRadius }} draggable={false} />}

                    {el.type === 'progress-bar' && (
                        <div style={{ width: '100%', height: '100%', backgroundColor: el.chartProps?.backgroundColor || '#e2e8f0', borderRadius: el.style.borderRadius, overflow: 'hidden' }}>
                            <div style={{ width: `${el.chartProps?.value || 0}%`, height: '100%', backgroundColor: el.chartProps?.color || '#3b82f6', borderRadius: el.style.borderRadius }} />
                        </div>
                    )}

                    {el.type === 'sparkline' && (
                        <div style={{ width: '100%', height: '100%' }}>
                            <svg width="100%" height="100%" viewBox={`0 0 ${parseInt(el.style.width?.toString() || '100')} ${parseInt(el.style.height?.toString() || '50')}`} preserveAspectRatio="none">
                                <path d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'))} fill="none" stroke={el.chartProps?.color || '#3b82f6'} strokeWidth={el.chartProps?.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}

                    {el.type === 'area-chart' && (
                        <div style={{ width: '100%', height: '100%' }}>
                            <svg width="100%" height="100%" viewBox={`0 0 ${parseInt(el.style.width?.toString() || '100')} ${parseInt(el.style.height?.toString() || '50')}`} preserveAspectRatio="none">
                                <path d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'), true)} fill={el.chartProps?.backgroundColor || '#dbeafe'} stroke="none" />
                                <path d={getSparklinePath(el.chartProps?.dataPoints || [], parseInt(el.style.width?.toString() || '100'), parseInt(el.style.height?.toString() || '50'))} fill="none" stroke={el.chartProps?.color || '#3b82f6'} strokeWidth={el.chartProps?.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}

                    {/* HORIZONTAL BAR CHART */}
                    {el.type === 'bar-chart' && (
                        <div style={{ width: '100%', height: '100%' }}>
                             {(() => {
                                const data = el.chartProps?.dataPoints || [];
                                const cats = el.chartProps?.categories || [];
                                const w = parseInt(el.style.width?.toString() || '100');
                                const h = parseInt(el.style.height?.toString() || '100');
                                const max = Math.max(...data, 1);
                                const gap = 4;
                                const barHeight = (h - (data.length - 1) * gap) / data.length;
                                
                                return (
                                    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                                        {data.map((val, i) => {
                                            const barW = (val / max) * w;
                                            const y = i * (barHeight + gap);
                                            const x = 0;
                                            return (
                                                <g key={i}>
                                                    <rect x={x} y={y} width={barW} height={barHeight} fill={el.chartProps?.color || '#3b82f6'} rx={2} />
                                                    {cats[i] && (
                                                        <text x={x + 4} y={y + barHeight/2 + 3} fontSize={10} fill={el.style.color || '#fff'} fontFamily="Inter, sans-serif" fontWeight="500">
                                                            {cats[i]}
                                                        </text>
                                                    )}
                                                </g>
                                            )
                                        })}
                                    </svg>
                                )
                             })()}
                        </div>
                    )}

                    {/* VERTICAL COLUMN CHART */}
                    {el.type === 'column-chart' && (
                        <div style={{ width: '100%', height: '100%' }}>
                             {(() => {
                                const data = el.chartProps?.dataPoints || [];
                                const cats = el.chartProps?.categories || [];
                                const w = parseInt(el.style.width?.toString() || '100');
                                const h = parseInt(el.style.height?.toString() || '100');
                                const max = Math.max(...data, 1);
                                const gap = 4;
                                const colWidth = (w - (data.length - 1) * gap) / data.length;
                                const labelHeight = 16;
                                const chartHeight = h - labelHeight;

                                return (
                                    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                                        {data.map((val, i) => {
                                            const barH = (val / max) * chartHeight;
                                            const x = i * (colWidth + gap);
                                            const y = chartHeight - barH;
                                            return (
                                                <g key={i}>
                                                    <rect x={x} y={y} width={colWidth} height={barH} fill={el.chartProps?.color || '#3b82f6'} rx={2} />
                                                    {cats[i] && (
                                                        <text x={x + colWidth/2} y={h} textAnchor="middle" fontSize={10} fill={el.style.color || '#64748b'} fontFamily="Inter, sans-serif">
                                                            {cats[i]}
                                                        </text>
                                                    )}
                                                </g>
                                            )
                                        })}
                                    </svg>
                                )
                             })()}
                        </div>
                    )}

                    {/* SELECTION CONTROLS */}
                    {isSelected && !isEditing && !isPanning && interactionMode === 'cursor' && (
                        <>
                            {/* Rotation Handle */}
                            <div 
                                className="absolute left-1/2 -top-6 w-6 h-6 -ml-3 flex items-center justify-center cursor-pointer group/rotate"
                                onMouseDown={handleRotateStart}
                                style={{ transform: `scale(${1/scale})` }}
                            >
                                <div className="w-2.5 h-2.5 bg-blue-600 border border-white rounded-full shadow-sm group-hover/rotate:bg-blue-500 transition-colors"></div>
                                <div className="absolute top-2.5 w-px h-3.5 bg-blue-600"></div>
                            </div>

                            {/* Resize Handles */}
                            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((dir) => (
                                <div 
                                    key={dir}
                                    onMouseDown={(e) => handleResizeStart(e, dir as any)}
                                    className={`absolute rounded-full hover:scale-125 transition-transform`}
                                    style={getHandleStyle(dir as any)}
                                />
                            ))}
                        </>
                    )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Canvas;