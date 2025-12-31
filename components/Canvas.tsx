import React, { useRef, useState, useEffect } from 'react';
import { CanvasElement, CanvasSettings, AnimationEasing, AnimationConfig } from '../types';
import { ICON_PATHS } from '../constants';

type ResizeDirection = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e';
type InteractionMode = 'cursor' | 'hand';

const ROOT_ID = 'CANVAS_ROOT';

// --- ANIMATION HELPERS ---
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
    'pulse-idle': '@keyframes pulse-idle { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }',
    'carousel-fade-idle': '@keyframes carousel-fade-idle { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }'
};

const SELECTION_ANIMATION = `
@keyframes select-pop {
    0% { opacity: 0; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 1; transform: scale(1); }
}
`;

interface CanvasProps {
  elements: CanvasElement[];
  settings: CanvasSettings;
  selectedIds: string[]; // UPDATED: Array
  onSelect: (ids: string[]) => void; // UPDATED: Array callback
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onInteractionStart?: () => void;
  emptyStateText: { title: string, desc: string };
  animationTrigger?: number;
}

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  settings, 
  selectedIds, 
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
  // Store initial positions of ALL selected elements for group drag
  const [dragStart, setDragStart] = useState<{ x: number, y: number, initialPositions: Record<string, { left: number, top: number }> }>({ x: 0, y: 0, initialPositions: {} });
  
  // Hover State
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Resize State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDirection | null>(null);
  const [initialResize, setInitialResize] = useState({ x: 0, y: 0, w: 0, h: 0, left: 0, top: 0 });
  
  // Rotation State
  const [isRotating, setIsRotating] = useState(false);
  const [initialRotation, setInitialRotation] = useState({ x: 0, y: 0, angle: 0, startRotation: 0 });

  // Smart Guides State
  const [guides, setGuides] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });

  const [editingId, setEditingId] = useState<string | null>(null);

  // --- SELECTION BOX STATE ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ startX: number, startY: number, currentX: number, currentY: number } | null>(null);

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
      onInteractionStart?.();
      
      // Resizing only works for single selection logic primarily in this version
      const primaryId = selectedIds[selectedIds.length - 1];
      const el = elements.find(el => el.id === primaryId);
      if (!el) return;
      
      const elementNode = document.getElementById(`element-${primaryId}`);
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
      onInteractionStart?.();

      const primaryId = selectedIds[selectedIds.length - 1];
      const el = elements.find(el => el.id === primaryId);
      if (!el) return;
      
      const elementNode = document.getElementById(`element-${primaryId}`);
      if (!elementNode) return;
      const box = elementNode.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      
      setIsRotating(true);
      setInitialRotation({ x: centerX, y: centerY, angle: Math.atan2(e.clientY - centerY, e.clientX - centerX), startRotation: getRotationAngle(el.style.transform?.toString()) });
  };
  
  const handleGlobalMouseMove = (e: MouseEvent) => {
      const snap = e.ctrlKey ? 1 : 1; 
      
      if (isPanning) { 
          setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY })); 
          return; 
      }

      // --- MARQUEE SELECTION ---
      if (isSelecting && selectionBox) {
          setSelectionBox(prev => prev ? ({ ...prev, currentX: e.clientX, currentY: e.clientY }) : null);
          return;
      }
      
      const primaryId = selectedIds[selectedIds.length - 1];

      if (isRotating && primaryId) {
          const currentAngle = Math.atan2(e.clientY - initialRotation.y, e.clientX - initialRotation.x);
          let deg = initialRotation.startRotation + (currentAngle - initialRotation.angle) * (180 / Math.PI);
          if (e.shiftKey) deg = Math.round(deg / 15) * 15;
          onUpdate(primaryId, { style: { ...elements.find(el => el.id === primaryId)?.style, transform: `rotate(${Math.round(deg)}deg)` } });
          return;
      }
      
      if (isResizing && primaryId && resizeDir) {
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
           onUpdate(primaryId, { style: { ...elements.find(el => el.id === primaryId)?.style, ...newStyle } });
           return;
      }
      
      // --- MULTI-ELEMENT DRAGGING ---
      if (isDraggingElement && selectedIds.length > 0 && interactionMode === 'cursor') {
          if (isResizing) return;
          
          const dx = (e.clientX - dragStart.x) / scale;
          const dy = (e.clientY - dragStart.y) / scale;

          // If dragging single item, apply smart guides
          let snappedDX = dx;
          let snappedDY = dy;
          
          // Smart Guides Logic (Only for Single Selection currently to avoid chaos)
          if (selectedIds.length === 1) {
              const el = elements.find(el => el.id === selectedIds[0]);
              if (el) {
                  const initialPos = dragStart.initialPositions[el.id];
                  let newLeft = initialPos.left + dx;
                  let newTop = initialPos.top + dy;
                  
                  const width = parseInt(el.style.width?.toString() || '0');
                  const height = parseInt(el.style.height?.toString() || '0');
                  const centerX = newLeft + width / 2;
                  const centerY = newTop + height / 2;
                  const canvasCenterX = settings.width / 2;
                  const canvasCenterY = settings.height / 2;
                  const snapThreshold = 5;
                  let guideX = null;
                  let guideY = null;

                  if (Math.abs(centerX - canvasCenterX) < snapThreshold) {
                      newLeft = canvasCenterX - width / 2;
                      guideX = canvasCenterX;
                      snappedDX = newLeft - initialPos.left;
                  }
                  if (Math.abs(centerY - canvasCenterY) < snapThreshold) {
                      newTop = canvasCenterY - height / 2;
                      guideY = canvasCenterY;
                      snappedDY = newTop - initialPos.top;
                  }
                  setGuides({ x: guideX, y: guideY });
              }
          } else {
              setGuides({ x: null, y: null });
          }

          // Update ALL selected elements
          selectedIds.forEach(id => {
              const initialPos = dragStart.initialPositions[id];
              if (initialPos) {
                  onUpdate(id, {
                      style: {
                          ...elements.find(el => el.id === id)?.style,
                          left: Math.round(initialPos.left + snappedDX),
                          top: Math.round(initialPos.top + snappedDY)
                      }
                  });
              }
          });

      } else {
          if (guides.x !== null || guides.y !== null) setGuides({ x: null, y: null });
      }
  };
  
  const handleGlobalMouseUp = () => { 
      // --- MARQUEE SELECTION END ---
      if (isSelecting && selectionBox) {
          // Check if it was a drag or a click
          const dx = Math.abs(selectionBox.currentX - selectionBox.startX);
          const dy = Math.abs(selectionBox.currentY - selectionBox.startY);
          const isClick = dx < 5 && dy < 5;

          if (!isClick) {
              // Convert Selection Box (Screen Space) to Canvas Space
              // BBox: left, top, right, bottom (screen coords)
              const boxLeft = Math.min(selectionBox.startX, selectionBox.currentX);
              const boxTop = Math.min(selectionBox.startY, selectionBox.currentY);
              const boxRight = Math.max(selectionBox.startX, selectionBox.currentX);
              const boxBottom = Math.max(selectionBox.startY, selectionBox.currentY);

              // Iterate elements and check overlap
              const intersectedIds: string[] = [];
              
              elements.forEach(el => {
                  const elNode = document.getElementById(`element-${el.id}`);
                  if (elNode) {
                      const rect = elNode.getBoundingClientRect();
                      // Check intersection
                      const overlap = !(rect.right < boxLeft || 
                                      rect.left > boxRight || 
                                      rect.bottom < boxTop || 
                                      rect.top > boxBottom);
                      
                      if (overlap) {
                          intersectedIds.push(el.id);
                      }
                  }
              });
              
              onSelect(intersectedIds); // Select all intersected (or empty if none)
          } 
          // If it IS a click, we rely on the MouseDown handlers to have set the correct selection 
          // (either Card or Element), so we do NOTHING here regarding selection.

          setSelectionBox(null);
          setIsSelecting(false);
      }

      setIsDraggingElement(false); 
      setIsResizing(false); 
      setIsRotating(false); 
      setIsPanning(false); 
      setResizeDir(null); 
      setGuides({ x: null, y: null });
  };
  
  useEffect(() => { window.addEventListener('mousemove', handleGlobalMouseMove); window.addEventListener('mouseup', handleGlobalMouseUp); return () => { window.removeEventListener('mousemove', handleGlobalMouseMove); window.removeEventListener('mouseup', handleGlobalMouseUp); }; }, [isDraggingElement, isResizing, isRotating, isPanning, selectedIds, scale, initialResize, resizeDir, interactionMode, dragStart, initialRotation, isSelecting, selectionBox]);
  
  const handleElementMouseDown = (e: React.MouseEvent, id: string) => { 
      if (isResizing || isRotating) return; 
      e.stopPropagation(); 
      e.preventDefault(); // Stop default to prevent text selection
      
      if (interactionMode === 'hand') { setIsPanning(true); return; } 
      if (editingId === id) return; 
      
      const el = elements.find(item => item.id === id); 
      if (!el) return; 
      
      let newSelection = [...selectedIds];

      // Multi-select Logic (Shift/Ctrl)
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
          if (newSelection.includes(id)) {
              // Deselect if already selected (unless it's the only one, maybe?)
              newSelection = newSelection.filter(sid => sid !== id);
          } else {
              // Ensure we remove ROOT_ID if it was there
              newSelection = newSelection.filter(sid => sid !== ROOT_ID);
              newSelection.push(id);
          }
      } else {
          // Single select
          newSelection = [id];
      }
      
      onSelect(newSelection);
      onInteractionStart?.();
      
      setIsDraggingElement(true); 
      
      // Snapshot initial positions of ALL currently selected items (including the one just clicked if valid)
      // Note: We use `newSelection` because state updates are async
      const initialPositions: Record<string, { left: number, top: number }> = {};
      newSelection.forEach(sid => {
          const item = elements.find(e => e.id === sid);
          if (item) {
              initialPositions[sid] = {
                  left: parseInt(item.style.left?.toString() || '0'),
                  top: parseInt(item.style.top?.toString() || '0')
              };
          }
      });

      setDragStart({ 
          x: e.clientX, 
          y: e.clientY, 
          initialPositions
      }); 
  };
  
  const handleBackgroundMouseDown = (e: React.MouseEvent) => { 
      if (e.button === 0) { 
          if (interactionMode === 'hand') { 
              setIsPanning(true); 
          } else { 
              // Clicked on infinite background: Deselect All
              onSelect([]); 
              setEditingId(null); 
              // Still allow marquee start from background
              setIsSelecting(true);
              setSelectionBox({ startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
          } 
      } 
      if (e.button === 1) { setIsPanning(true); } 
  };

  const handleCardMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation(); // Don't bubble to background handler (which would deselect)
      
      if (interactionMode === 'hand') {
          setIsPanning(true);
          return;
      }

      // Explicitly select the card root
      onSelect([ROOT_ID]);
      setEditingId(null);

      // Start Marquee logic on top of card
      setIsSelecting(true);
      setSelectionBox({ startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
  };

  // ... (Rest of rendering helpers remain same) ...
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
          
          if(entry && entry.type !== 'none') {
             usedKeys.add(`${entry.type}-entry`);
             const baseOpacity = 'opacity: 0;';
             const anim = `${entry.type}-entry ${entry.duration}s ${getBezier(entry.easing)} ${entry.delay}s forwards`;
             styles += `.el-${el.id}-entry { animation: ${anim}; ${baseOpacity} }`;
          } 
          
          if(idle && idle.type !== 'none') {
             usedKeys.add(`${idle.type}-idle`);
             const entryDuration = (entry && entry.type !== 'none') ? (entry.duration + entry.delay) : 0;
             const idleDelay = idle.delay + entryDuration;
             const anim = `${idle.type}-idle ${idle.duration}s ${getBezier(idle.easing)} ${idleDelay}s infinite`;
             styles += `.el-${el.id}-idle { animation: ${anim}; }`;
          }
          
          if(hover && hover.type !== 'none') {
              let transform = '';
              const intensity = (hover.intensity || 50) / 50;
              if (hover.type === 'scale') transform = `scale(${1 + 0.1 * intensity})`;
              if (hover.type === 'slide-up') transform = `translateY(-${5 * intensity}px)`;
              if (hover.type === 'slide-right') transform = `translateX(${5 * intensity}px)`;
              if (hover.type === 'rotate') transform = `rotate(${15 * intensity}deg)`;
              
              styles += `.el-${el.id}-hover.hover-active { transform: ${transform}; transition: transform ${hover.duration}s ease; }`;
              styles += `.el-${el.id}-hover { transition: transform ${hover.duration}s ease; }`; 
          }
      });

      const keyframes = Array.from(usedKeys).map(key => KEYFRAME_DEFINITIONS[key] || '').join('\n');
      return keyframes + styles + SELECTION_ANIMATION;
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

  const getHandleStyle = (dir: ResizeDirection) => {
      const base: React.CSSProperties = {
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          border: '1px solid #fff', 
          zIndex: 50,
          transform: `translate(-50%, -50%) scale(${1/scale})`, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          pointerEvents: 'auto'
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

  const isCardSelected = selectedIds.includes(ROOT_ID);

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

        {/* Selection Box Render */}
        {isSelecting && selectionBox && (
            <div 
                style={{
                    position: 'fixed',
                    left: Math.min(selectionBox.startX, selectionBox.currentX),
                    top: Math.min(selectionBox.startY, selectionBox.currentY),
                    width: Math.abs(selectionBox.currentX - selectionBox.startX),
                    height: Math.abs(selectionBox.currentY - selectionBox.startY),
                    border: '1px solid #3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    pointerEvents: 'none',
                    zIndex: 99999
                }}
            />
        )}

        {/* Light Gray Infinite Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
            style={{ 
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', 
                backgroundSize: `${40 * scale}px ${40 * scale}px`,
                backgroundPosition: `${offset.x}px ${offset.y}px`
            }} 
        />
        
        {/* FLOATING CONTROLS */}
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
        <div style={{ position: 'relative' }}>
            {/* CONTENT LAYER */}
            <div 
                key={animationTrigger}
                style={{
                width: settings.width,
                height: settings.height,
                backgroundColor: settings.backgroundColor,
                background: (settings as any).background || settings.backgroundColor,
                borderRadius: settings.borderRadius,
                borderWidth: settings.borderWidth,
                borderColor: settings.borderColor,
                borderStyle: settings.borderStyle || 'solid',
                boxShadow: settings.showShadow ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : '0 0 0 1px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden', 
                backgroundImage: (settings.backgroundColor === 'transparent' && !(settings as any).background) ? 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)' : 'none',
                backgroundSize: (settings.backgroundColor === 'transparent' && !(settings as any).background) ? '20px 20px' : 'cover',
                backgroundPosition: (settings.backgroundColor === 'transparent' && !(settings as any).background) ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center center',
                // Card Selection Visual Feedback
                outline: isCardSelected ? '2px solid #3b82f6' : 'none',
                outlineOffset: isCardSelected ? '4px' : '0',
                transition: 'box-shadow 0.3s, outline 0.2s',
                animation: isCardSelected ? 'select-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                }}
                className={`transition-shadow duration-300 ${isCardSelected ? 'ring-0' : ''}`}
                onMouseDown={handleCardMouseDown}
            >
                {/* Smart Guides */}
                {guides.x !== null && (
                    <div className="absolute top-0 bottom-0 border-l border-dashed border-pink-500 z-[9999] pointer-events-none" style={{ left: guides.x, height: '100%', borderWidth: '1px' }} />
                )}
                {guides.y !== null && (
                    <div className="absolute left-0 right-0 border-t border-dashed border-pink-500 z-[9999] pointer-events-none" style={{ top: guides.y, width: '100%', borderWidth: '1px' }} />
                )}

                {/* Empty State */}
                {elements.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 pointer-events-none select-none text-center p-4">
                        <span className="material-symbols-outlined text-6xl mb-2 text-gray-400">drag_click</span>
                        <h3 className="font-bold text-gray-500 text-sm">{emptyStateText.title}</h3>
                        <p className="text-[10px] text-gray-500">{emptyStateText.desc}</p>
                    </div>
                )}

                {elements.map(el => {
                    const isSelected = selectedIds.includes(el.id);
                    const isEditing = editingId === el.id;
                    const entryClass = `el-${el.id}-entry`;
                    const idleClass = `el-${el.id}-idle`;
                    const hoverClass = `el-${el.id}-hover`;
                    
                    const entryVars = getAnimationVars(el.animation?.entry, 'enter');
                    const idleVars = getAnimationVars(el.animation?.idle, 'idle');
                    
                    const elementStyle: any = { ...el.style, ...entryVars };
                    if ((el.style as any).background) {
                        elementStyle.background = (el.style as any).background;
                        delete elementStyle.backgroundColor;
                    }
                    const isTextGradient = (el.style as any).WebkitBackgroundClip === 'text';
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
                            ...(isTextGradient ? { background: 'transparent', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' } : {}),
                            position: 'absolute',
                            zIndex: el.style.zIndex || 1,
                            userSelect: isEditing ? 'text' : 'none',
                            boxSizing: 'border-box',
                            outline: 'none',
                        }}
                        className={`group ${entryClass} ${interactionMode === 'cursor' ? 'cursor-move' : 'cursor-grab'}`}
                        >
                        {/* 1. IDLE WRAPPER */}
                        <div className={`w-full h-full ${idleClass}`} style={{ ...idleVars, width: '100%', height: '100%' }}>
                            {/* 2. HOVER WRAPPER */}
                            <div className={`w-full h-full ${hoverClass} ${hoveredId === el.id ? 'hover-active' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
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
                                                letterSpacing: el.style.letterSpacing, textTransform: el.style.textTransform as any,
                                                textDecoration: el.style.textDecoration, fontStyle: el.style.fontStyle
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: el.style.textAlign === 'center' ? 'center' : el.style.textAlign === 'right' ? 'flex-end' : 'flex-start', whiteSpace: 'pre-wrap' }}>
                                            {isTextGradient ? (
                                                <span style={{ backgroundImage: (el.style as any).backgroundImage, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{el.content}</span>
                                            ) : (el.content)}
                                        </div>
                                    )
                                )}
                                {el.type === 'box' && <div style={{ width: '100%', height: '100%' }} />}
                                {el.type === 'icon' && (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(isTextGradient ? { background: (el.style as any).backgroundImage, WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='${ICON_PATHS[el.content || 'star'] || ''}'/%3E%3C/svg%3E")`, WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', WebkitMaskSize: 'contain' } : {}) }}>
                                        {ICON_PATHS[el.content || ''] ? (
                                            !isTextGradient && (<svg viewBox="0 0 24 24" width="100%" height="100%" fill={el.style.color?.toString()}><path d={ICON_PATHS[el.content || 'star'] || ''} /></svg>)
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: el.style.fontSize, color: isTextGradient ? 'transparent' : el.style.color, ...(isTextGradient ? { backgroundImage: (el.style as any).backgroundImage, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}) }}>{el.content}</span>
                                        )}
                                    </div>
                                )}
                                {el.type === 'image' && <img src={el.chartProps?.imageUrl || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: el.style.borderRadius }} draggable={false} />}
                                {el.type === 'progress-bar' && (
                                    <div style={{ width: '100%', height: '100%', backgroundColor: el.chartProps?.backgroundColor || '#e2e8f0', borderRadius: el.style.borderRadius, overflow: 'hidden' }}>
                                        <div style={{ width: `${el.chartProps?.value || 0}%`, height: '100%', backgroundColor: el.chartProps?.color || '#3b82f6', borderRadius: el.style.borderRadius }} />
                                    </div>
                                )}
                                {el.type === 'circular-progress' && (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {(() => {
                                            const width = parseInt(el.style.width?.toString() || '100');
                                            const height = parseInt(el.style.height?.toString() || '100');
                                            const size = Math.min(width, height);
                                            const strokeWidth = el.chartProps?.strokeWidth || 8;
                                            const radius = (size - strokeWidth) / 2;
                                            const circumference = 2 * Math.PI * radius;
                                            const value = Math.min(Math.max(el.chartProps?.value || 0, 0), 100);
                                            const offset = circumference - (value / 100) * circumference;
                                            const center = size / 2;
                                            return (
                                                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx={center} cy={center} r={radius > 0 ? radius : 0} fill="none" stroke={el.chartProps?.backgroundColor || '#e2e8f0'} strokeWidth={strokeWidth} />
                                                    <circle cx={center} cy={center} r={radius > 0 ? radius : 0} fill="none" stroke={el.chartProps?.color || '#3b82f6'} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
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
                                                    {el.tableProps.columns.map(col => (<th key={col.id} style={{ width: `${col.width}%`, padding: '8px', fontSize: '10px', color: el.tableProps?.headerColor, fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase' }}>{col.header}</th>))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[1, 2, 3].map(r => (
                                                    <tr key={r} style={{ borderBottom: `1px solid ${el.tableProps?.gridColor}`, height: el.tableProps?.rowHeight }}>
                                                        {el.tableProps?.columns.map(col => (<td key={col.id} style={{ padding: '8px', fontSize: '12px', color: el.tableProps?.rowColor, backgroundColor: el.tableProps?.rowBgColor }}><div style={{ width: '60%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div></td>))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                                                        return (<g key={i}><rect x={0} y={y} width={barW} height={barHeight} fill={el.chartProps?.color || '#3b82f6'} rx={2} />{cats[i] && (<text x={4} y={y + barHeight/2 + 3} fontSize={10} fill={el.style.color || '#fff'} fontFamily="Inter, sans-serif" fontWeight="500">{cats[i]}</text>)}</g>)
                                                    })}
                                                </svg>
                                            )
                                        })()}
                                    </div>
                                )}
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
                                                        return (<g key={i}><rect x={x} y={y} width={colWidth} height={barH} fill={el.chartProps?.color || '#3b82f6'} rx={2} />{cats[i] && (<text x={x + colWidth/2} y={h} textAnchor="middle" fontSize={10} fill={el.style.color || '#64748b'} fontFamily="Inter, sans-serif">{cats[i]}</text>)}</g>)
                                                    })}
                                                </svg>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div> 
                        </div>
                        </div>
                    );
                })}
            </div>

            {/* OVERLAY LAYER FOR SELECTION CONTROLS */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
                {elements.map(el => {
                    const isSelected = selectedIds.includes(el.id);
                    if (isPanning || editingId) return null;

                    const elementNode = document.getElementById(`element-${el.id}`);
                    const w = el.style.width || (elementNode?.offsetWidth) || (el.type === 'icon' ? (el.style.fontSize || 24) : 100);
                    const h = el.style.height || (elementNode?.offsetHeight) || (el.type === 'icon' ? (el.style.fontSize || 24) : 24);

                    const left = typeof el.style.left === 'number' ? el.style.left : parseInt(el.style.left?.toString() || '0');
                    const top = typeof el.style.top === 'number' ? el.style.top : parseInt(el.style.top?.toString() || '0');
                    const widthVal = typeof w === 'number' ? w : parseInt(w.toString());
                    const heightVal = typeof h === 'number' ? h : parseInt(h.toString());
                    
                    const isOutOfBounds = (left < 0) || (top < 0) || (left + widthVal > settings.width) || (top + heightVal > settings.height);
                    const showGhost = !isSelected && isOutOfBounds;

                    return (
                        <div
                            key={`overlay-${el.id}`}
                            onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                            onMouseEnter={() => setHoveredId(el.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                position: 'absolute',
                                left: el.style.left,
                                top: el.style.top,
                                width: w,
                                height: h,
                                transform: el.style.transform,
                                pointerEvents: 'auto', 
                                border: isSelected ? 'none' : (showGhost ? '2px dashed rgba(100, 116, 139, 0.5)' : 'none'), 
                                opacity: isSelected ? 1 : (showGhost ? 0.6 : 0) 
                            }}
                            className={`transition-opacity ${isSelected ? 'z-50' : 'z-10 hover:opacity-100 hover:border-blue-400'}`}
                        >
                            {isSelected && interactionMode === 'cursor' && (
                                <>
                                    {/* Outline with Visual Feedback */}
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        outline: '2px solid #3b82f6', 
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                        pointerEvents: 'none',
                                        animation: 'select-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}></div>

                                    {/* Show handles only if SINGLE element is selected OR if it's the specific behavior desired. 
                                        Here we show handles for all selected to indicate selection, but resizing typically only works on the primary one easily without grouping. 
                                        For simplicity, we only show rotation/resize handles if ONE item is selected. 
                                    */}
                                    {selectedIds.length === 1 && (
                                        <>
                                            <div 
                                                className="absolute left-1/2 -top-6 w-6 h-6 -ml-3 flex items-center justify-center cursor-pointer group/rotate"
                                                onMouseDown={handleRotateStart}
                                                style={{ transform: `scale(${1/scale})`, pointerEvents: 'auto' }}
                                            >
                                                <div className="w-2.5 h-2.5 bg-blue-600 border border-white rounded-full shadow-sm group-hover/rotate:bg-blue-500 transition-colors"></div>
                                                <div className="absolute top-2.5 w-px h-3.5 bg-blue-600"></div>
                                            </div>

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
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;