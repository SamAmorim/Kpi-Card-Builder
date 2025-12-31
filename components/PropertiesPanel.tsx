import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, CanvasSettings, Translation, ConditionalRule, AnimationConfig, AnimationType, AnimationEasing, GlassSettings } from '../types';
import { FONTS, ICONS, ICON_PATHS } from '../constants';
import LayersPanel from './LayersPanel';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | undefined;
  elements: CanvasElement[];
  canvasSettings: CanvasSettings;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateCanvas: (updates: Partial<CanvasSettings>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string | null) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  t: Translation;
}

// --- VISUAL HELPERS & STYLES ---

const PREVIEW_STYLES = `
  @keyframes ui-fade { 0% { opacity: 0.3; } 100% { opacity: 1; } }
  @keyframes ui-slide-up { 0% { transform: translateY(5px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
  /* ... (animations kept same) ... */
`;

const getPreviewAnimation = (type: string, isIdle: boolean) => {
    if (type === 'none') return 'none';
    const prefix = isIdle ? '-idle' : '';
    const iter = 'infinite'; 
    const dur = isIdle ? '2s' : '1.5s';
    return `ui-${type}${prefix} ${dur} ease-in-out ${iter}`;
};

// Reusable Input Components - WHITE THEME
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{children}</label>
);

const SectionTitle: React.FC<{ icon: string, title: string }> = ({ icon, title }) => (
    <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center border-b border-slate-100 pb-2">
        <span className="material-symbols-outlined text-base mr-1.5 text-blue-600">{icon}</span> 
        {title}
    </h3>
);

const NumberInput: React.FC<{ label?: string, value: number, onChange: (val: number) => void, unit?: string, min?: number, max?: number }> = ({ label, value, onChange, unit, min, max }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) onChange(val);
    };

    return (
        <div className="flex-1">
            {label && <Label>{label}</Label>}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-sm">
                <input
                    type="number"
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={0.1}
                    className="w-full bg-transparent text-xs py-2 px-2 outline-none text-slate-900 font-medium font-sans placeholder-slate-400"
                />
                {unit && <span className="text-[10px] text-slate-400 pr-2 select-none font-medium">{unit}</span>}
            </div>
        </div>
    );
};

const ColorPicker: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex-1">
        <Label>{label}</Label>
        <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform bg-white">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-1 -left-1 cursor-pointer p-0 border-none"
                />
            </div>
            <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 hover:border-slate-300 transition-all">
                <span className="text-slate-400 text-xs mr-1 select-none">#</span>
                <input 
                    type="text" 
                    value={value.replace('#', '')}
                    onChange={(e) => {
                        // Sanitize input to allow pasting full hex codes
                        const clean = e.target.value.replace(/#/g, '');
                        onChange(`#${clean}`);
                    }}
                    className="w-full bg-transparent text-xs outline-none font-medium uppercase text-slate-700"
                    maxLength={7}
                />
            </div>
        </div>
    </div>
);

// New Visual Animation Selector - WHITE THEME
const AnimationGridSelector: React.FC<{ 
    options: AnimationType[], 
    value: AnimationType, 
    onChange: (val: AnimationType) => void,
    isIdle?: boolean
}> = ({ options, value, onChange, isIdle }) => {
    return (
        <div className="grid grid-cols-4 gap-2 mb-3">
            <button 
                onClick={() => onChange('none')}
                className={`col-span-4 flex items-center justify-center py-1.5 rounded-md text-[10px] font-bold border transition-all ${value === 'none' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-transparent border-slate-200 text-slate-400 hover:bg-slate-50'}`}
            >
                No Animation
            </button>
            {options.map(opt => {
                const isActive = value === opt;
                if (opt === 'none') return null;
                return (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all aspect-square ${isActive ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                        title={opt}
                    >
                        <div 
                            className={`w-5 h-5 mb-1 flex items-center justify-center ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                            style={{ 
                                animation: getPreviewAnimation(opt, !!isIdle),
                                animationPlayState: 'running'
                            }} 
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </div>
                        <span className={`text-[9px] capitalize truncate w-full text-center ${isActive ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>{opt.replace('-', ' ')}</span>
                    </button>
                )
            })}
        </div>
    );
};

const AnimationControl: React.FC<{ 
    title: string, 
    config: AnimationConfig, 
    onChange: (cfg: AnimationConfig) => void,
    types: AnimationType[],
    isIdle?: boolean
}> = ({ title, config, onChange, types, isIdle }) => {
    return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
                 <h4 className="text-xs font-bold text-slate-700 flex items-center">
                    {isIdle ? <span className="material-symbols-outlined text-sm mr-1 text-purple-500">all_inclusive</span> : <span className="material-symbols-outlined text-sm mr-1 text-green-500">play_circle</span>}
                    {title}
                 </h4>
                 {config.type !== 'none' && (
                     <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">Active</span>
                 )}
            </div>
            
            <AnimationGridSelector 
                options={types} 
                value={config.type} 
                onChange={(v) => onChange({...config, type: v})} 
                isIdle={isIdle}
            />

            {config.type !== 'none' && (
                <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in slide-in-from-top-1">
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput label="Duration (s)" value={config.duration} onChange={(v) => onChange({...config, duration: v})} min={0.1} />
                        <NumberInput label="Delay (s)" value={config.delay} onChange={(v) => onChange({...config, delay: v})} min={0} />
                    </div>
                    
                    <div>
                         <div className="flex justify-between mb-1">
                             <Label>Intensity</Label>
                             <span className="text-[10px] font-bold text-slate-500">{config.intensity}%</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={config.intensity} 
                            onChange={(e) => onChange({...config, intensity: parseInt(e.target.value)})} 
                            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer hover:bg-slate-300 transition-colors"
                        />
                    </div>

                    <div>
                        <Label>Easing Style</Label>
                        <select 
                            value={config.easing}
                            onChange={(e) => onChange({...config, easing: e.target.value as AnimationEasing})}
                            className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                        >
                            <option value="linear">Linear (Constant)</option>
                            <option value="ease">Ease (Smooth)</option>
                            <option value="ease-out">Ease Out (Slow End)</option>
                            <option value="elastic">Elastic (Bouncy)</option>
                            <option value="bounce-out">Bounce (Hit Wall)</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- DATA HELPERS (UX) - WHITE THEME ---
const DataGuide: React.FC<{ type: CanvasElement['type'], t: Translation }> = ({ type, t }) => {
    let title = t.dataGuideTitle;
    let desc = t.dataGuide_text_desc;
    let example = "e.g. [Total Sales]";
    let icon = "data_object";
    let color = "bg-blue-50 text-blue-700 border-blue-200";

    if (type === 'text') {
        desc = t.dataGuide_text_desc;
        example = "'Sales: ' & FORMAT([Value], '$0')";
    } else if (type === 'progress-bar' || type === 'circular-progress') {
        title = "Percentage Value";
        desc = t.dataGuide_progress_desc;
        example = "0.75 (= 75%)";
        icon = "percent";
        color = "bg-purple-50 text-purple-700 border-purple-200";
    } else if (['sparkline', 'area-chart', 'bar-chart', 'column-chart'].includes(type)) {
        title = "Chart Data Source";
        desc = t.dataGuide_chart_desc;
        example = "Needs: VALUES('Date'[Date])";
        icon = "dataset";
        color = "bg-orange-50 text-orange-700 border-orange-200";
    } else if (type === 'image') {
        title = "Image URL";
        desc = t.dataGuide_image_desc;
        example = `"https://mysite.com/logo.png"`;
        icon = "link";
    }

    return (
        <div className={`mt-2 p-3 rounded-lg border ${color} flex items-start space-x-2`}>
            <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">{icon}</span>
            <div>
                <strong className="block text-[10px] font-bold uppercase tracking-wide mb-0.5">{title}</strong>
                <p className="text-[10px] leading-tight opacity-90 text-slate-600">{desc}</p>
                <code className="block mt-1.5 text-[10px] bg-white px-1.5 py-0.5 rounded font-mono border border-black/5 shadow-sm">{example}</code>
            </div>
        </div>
    );
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement, 
  elements,
  canvasSettings,
  onUpdateElement, 
  onUpdateCanvas,
  onDelete,
  onSelect,
  onReorder,
  t 
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'animations'>('properties');
  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
     targetProperty: 'color', operator: '>', value: 0, outputColor: '#ff0000'
  });
  
  const [glowColor, setGlowColor] = useState('#3b82f6');
  const [glowBlur, setGlowBlur] = useState(20);

  // Helpers
  const getRotation = (transform: string | undefined): number => {
      if (!transform) return 0;
      const match = transform.match(/rotate\(([-]?\d+)deg\)/);
      return match ? parseInt(match[1]) : 0;
  };

  const handleStyleChange = (key: keyof React.CSSProperties, value: any) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, [key]: value }
    });
  };

  const handleRotationChange = (deg: number) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
        style: { ...selectedElement.style, transform: `rotate(${deg}deg)` }
    });
  };

  const handleChartPropChange = (key: string, value: any) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, {
      chartProps: { ...selectedElement.chartProps, [key]: value }
    });
  };

  const handleAnimationChange = (key: 'entry' | 'hover' | 'idle', cfg: AnimationConfig) => {
      if (!selectedElement) return;
      const currentAnim = selectedElement.animation || {
          entry: { type: 'none', duration: 0.5, delay: 0, easing: 'ease-out', intensity: 50 },
          hover: { type: 'none', duration: 0.3, delay: 0, easing: 'ease', intensity: 50 },
          idle: { type: 'none', duration: 2, delay: 0, easing: 'linear', intensity: 50, infinite: true }
      };
      
      onUpdateElement(selectedElement.id, {
          animation: { ...currentAnim, [key]: cfg }
      });
  };

  const handleGlassChange = (updates: Partial<GlassSettings>) => {
      if (!selectedElement) return;
      const currentGlass = selectedElement.glass || { enabled: false, blur: 8, opacity: 20 };
      onUpdateElement(selectedElement.id, {
          glass: { ...currentGlass, ...updates }
      });
  };

  // Helper for Glow/Shadow Logic
  const applyGlow = () => {
      if (!selectedElement) return;
      const isBox = selectedElement.type === 'box' || selectedElement.type === 'image';
      
      if (isBox) {
          handleStyleChange('boxShadow', `0 0 ${glowBlur}px ${glowColor}`);
      } else {
          handleStyleChange('filter', `drop-shadow(0 0 ${glowBlur}px ${glowColor})`);
      }
  };
  
  const removeGlow = () => {
      if (!selectedElement) return;
      handleStyleChange('boxShadow', undefined);
      handleStyleChange('filter', undefined);
  };

  // --- RENDERERS ---

  const renderCanvasSettings = () => (
    <div className="space-y-6 p-5">
        {/* Dimensions */}
        <div>
            <SectionTitle icon="aspect_ratio" title="Canvas Size" />
            <div className="flex space-x-3">
                <NumberInput label="Width" value={canvasSettings.width} onChange={(v) => onUpdateCanvas({width: v})} unit="px" />
                <NumberInput label="Height" value={canvasSettings.height} onChange={(v) => onUpdateCanvas({height: v})} unit="px" />
            </div>
        </div>

        {/* Appearance */}
        <div>
             <SectionTitle icon="palette" title={t.appearance} />
             
             <div className="mb-4">
                <ColorPicker 
                    label="Background" 
                    value={canvasSettings.backgroundColor === 'transparent' ? '#ffffff' : canvasSettings.backgroundColor} 
                    onChange={(v) => onUpdateCanvas({ backgroundColor: v })} 
                />
                <button 
                    onClick={() => onUpdateCanvas({ backgroundColor: 'transparent' })}
                    className={`mt-2 w-full text-xs flex items-center justify-center px-2 py-2 rounded-lg border font-medium transition-colors ${canvasSettings.backgroundColor === 'transparent' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                    <span className="material-symbols-outlined text-sm mr-2">grid_off</span> Transparent BG
                </button>
             </div>

             <div className="space-y-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label>{t.borderRadius}</Label>
                        <span className="text-[10px] text-slate-600 font-bold">{canvasSettings.borderRadius}px</span>
                    </div>
                    <input type="range" min="0" max="50" value={canvasSettings.borderRadius} onChange={(e) => onUpdateCanvas({borderRadius: parseInt(e.target.value)})} className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                <div className="flex items-center justify-between">
                    <Label>{t.showShadow}</Label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="toggle" 
                            id="toggle"
                            checked={canvasSettings.showShadow}
                            onChange={(e) => onUpdateCanvas({showShadow: e.target.checked})}
                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5 border-slate-300"
                        />
                        <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${canvasSettings.showShadow ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
                    </div>
                </div>
             </div>
        </div>

        {/* Border */}
        <div>
            <SectionTitle icon="check_box_outline_blank" title="Border" />
            <div className="grid grid-cols-2 gap-3 mb-3">
                <NumberInput label={t.borderWidth} value={canvasSettings.borderWidth} onChange={(v) => onUpdateCanvas({borderWidth: v})} unit="px" />
                <ColorPicker label={t.borderColor} value={canvasSettings.borderColor} onChange={(v) => onUpdateCanvas({borderColor: v})} />
            </div>
            <div>
                <Label>{t.borderStyle}</Label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    {['solid', 'dashed', 'dotted'].map(s => (
                        <button 
                            key={s} 
                            onClick={() => onUpdateCanvas({borderStyle: s as any})}
                            className={`flex-1 py-2 text-[10px] uppercase font-bold transition-colors ${canvasSettings.borderStyle === s ? 'bg-slate-100 text-slate-800' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderElementProperties = () => {
    if (!selectedElement) return null;

    const addConditionalRule = () => {
        const rule: ConditionalRule = {
            id: uuidv4(),
            targetProperty: newRule.targetProperty as any,
            operator: newRule.operator as any,
            value: newRule.value as number,
            outputColor: newRule.outputColor as string
        };
        const existing = selectedElement.conditionalFormatting || [];
        onUpdateElement(selectedElement.id, { conditionalFormatting: [...existing, rule] });
    };

    const removeConditionalRule = (ruleId: string) => {
        const existing = selectedElement.conditionalFormatting || [];
        onUpdateElement(selectedElement.id, { conditionalFormatting: existing.filter(r => r.id !== ruleId) });
    };

    const glass = selectedElement.glass || { enabled: false, blur: 8, opacity: 20 };

    return (
        <div className="p-5 space-y-6 pb-20">
            {/* Variable Name & Data Guide */}
            <div>
                <Label>Power BI Variable Name</Label>
                <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => onUpdateElement(selectedElement.id, { name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-900 font-bold focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-sm placeholder-slate-400"
                    placeholder="e.g. TotalSales"
                />
                <DataGuide type={selectedElement.type} t={t} />
            </div>

            <hr className="border-slate-100" />

            {/* Layout */}
            <div>
                <SectionTitle icon="open_with" title={t.layout} />
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <NumberInput label="X Position" value={parseInt(selectedElement.style.left?.toString() || '0')} onChange={(v) => handleStyleChange('left', v)} />
                    <NumberInput label="Y Position" value={parseInt(selectedElement.style.top?.toString() || '0')} onChange={(v) => handleStyleChange('top', v)} />
                    <NumberInput label="Width" value={parseInt(selectedElement.style.width?.toString() || '0')} onChange={(v) => handleStyleChange('width', v)} />
                    <NumberInput label="Height" value={parseInt(selectedElement.style.height?.toString() || '0')} onChange={(v) => handleStyleChange('height', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <NumberInput label="Rotation" value={getRotation(selectedElement.style.transform?.toString())} onChange={handleRotationChange} unit="°" />
                </div>
            </div>

            <hr className="border-slate-100" />
            
             {/* ICON PICKER */}
             {selectedElement.type === 'icon' && (
                <div>
                    <SectionTitle icon="star" title={t.selectIcon} />
                    <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 max-h-48 overflow-y-auto custom-scrollbar">
                        {ICONS.map(iconKey => (
                            <button 
                                key={iconKey}
                                onClick={() => onUpdateElement(selectedElement.id, { content: iconKey })}
                                className={`aspect-square flex items-center justify-center rounded hover:bg-white hover:shadow-sm transition-all ${selectedElement.content === iconKey ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                                title={iconKey}
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d={ICON_PATHS[iconKey]} />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
             )}

            {/* Typography (Conditional) */}
            {selectedElement.type === 'text' && (
                <div>
                    <SectionTitle icon="text_fields" title={t.typography} />
                    <div className="space-y-4">
                        <div>
                            <Label>Text Content</Label>
                            <textarea
                                value={selectedElement.content}
                                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 min-h-[60px] text-slate-800 font-medium shadow-sm resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Font Family</Label>
                                <select 
                                    value={selectedElement.style.fontFamily?.toString().split(',')[0].replace(/['"]/g, '') || 'Inter'}
                                    onChange={(e) => handleStyleChange('fontFamily', `'${e.target.value}', sans-serif`)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none text-slate-700 font-medium shadow-sm focus:border-blue-500"
                                >
                                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <NumberInput label="Size" value={parseInt(selectedElement.style.fontSize?.toString() || '16')} onChange={(v) => handleStyleChange('fontSize', v)} unit="px" />
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => handleStyleChange('textAlign', align)}
                                    className={`px-3 py-2 hover:bg-slate-50 transition-colors ${selectedElement.style.textAlign === align ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_{align}</span>
                                </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handleStyleChange('fontWeight', selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                                className={`px-4 py-2 rounded-lg border text-xs font-bold transition-colors shadow-sm ${selectedElement.style.fontWeight === 'bold' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                            >
                                Bold
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Specific Element Props (Progress, Charts, Image) */}
            {selectedElement.type === 'progress-bar' && (
                 <div>
                    <SectionTitle icon="linear_scale" title="Progress Settings" />
                    <div className="space-y-3">
                         <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                             <input type="range" min="0" max="100" value={selectedElement.chartProps?.value || 0} onChange={(e) => handleChartPropChange('value', parseInt(e.target.value))} className="flex-1 accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                             <span className="text-xs font-mono w-10 text-right font-bold text-blue-600">{selectedElement.chartProps?.value}%</span>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             <ColorPicker label="Fill Color" value={selectedElement.chartProps?.color || '#000000'} onChange={(v) => handleChartPropChange('color', v)} />
                             <ColorPicker label="Track Color" value={selectedElement.chartProps?.backgroundColor || '#e0e0e0'} onChange={(v) => handleChartPropChange('backgroundColor', v)} />
                         </div>
                    </div>
                 </div>
            )}
            
            {(selectedElement.type === 'sparkline' || selectedElement.type === 'bar-chart' || selectedElement.type === 'area-chart' || selectedElement.type === 'column-chart') && (
                 <div>
                    <SectionTitle icon="insert_chart" title="Chart Data" />
                    <div className="space-y-3">
                         <div>
                            <Label>Data Points (Static Preview)</Label>
                            <input 
                                type="text"
                                value={selectedElement.chartProps?.dataPoints?.join(', ') || ''}
                                onChange={(e) => {
                                    const points = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                                    handleChartPropChange('dataPoints', points);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-700 font-mono shadow-sm focus:border-blue-500"
                                placeholder="10, 20, 15..."
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             <ColorPicker label="Color" value={selectedElement.chartProps?.color || '#3b82f6'} onChange={(v) => handleChartPropChange('color', v)} />
                         </div>
                    </div>
                 </div>
            )}
            
             {selectedElement.type === 'image' && (
                <div>
                    <SectionTitle icon="image" title="Image Source" />
                    <Label>{t.imageUrl}</Label>
                    <input
                        type="text"
                        value={selectedElement.chartProps?.imageUrl || ''}
                        onChange={(e) => handleChartPropChange('imageUrl', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none text-slate-700 mb-3 shadow-sm focus:border-blue-500"
                        placeholder="https://..."
                    />
                </div>
            )}

            <hr className="border-slate-100" />

            {/* Colors & Effects */}
            <div>
                 <SectionTitle icon="brush" title={t.appearance} />
                 <div className="grid grid-cols-2 gap-3 mb-4">
                     {(selectedElement.type === 'text' || selectedElement.type === 'icon') && (
                         <ColorPicker label="Foreground" value={selectedElement.style.color?.toString() || '#000000'} onChange={(v) => handleStyleChange('color', v)} />
                     )}
                     
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                            <Label>Background</Label>
                            <button 
                                onClick={() => handleStyleChange('backgroundColor', 'transparent')}
                                className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors flex items-center ${selectedElement.style.backgroundColor === 'transparent' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                title="Set Transparent"
                            >
                                <span className="material-symbols-outlined text-[10px] mr-1">grid_off</span> None
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                                <input
                                    type="color"
                                    value={selectedElement.style.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.style.backgroundColor?.toString() || '#ffffff'}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-1 -left-1 cursor-pointer p-0 border-none"
                                />
                                {selectedElement.style.backgroundColor === 'transparent' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 pointer-events-none">
                                        <span className="material-symbols-outlined text-xs text-red-400 transform rotate-45">remove</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50">
                                <span className="text-slate-400 text-xs mr-1 select-none">#</span>
                                <input 
                                    type="text" 
                                    value={selectedElement.style.backgroundColor === 'transparent' ? 'NONE' : selectedElement.style.backgroundColor?.toString().replace('#', '')}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/#/g, '');
                                        handleStyleChange('backgroundColor', `#${clean}`);
                                    }}
                                    className="w-full bg-transparent text-xs outline-none font-medium uppercase text-slate-700"
                                    maxLength={7}
                                    disabled={selectedElement.style.backgroundColor === 'transparent'}
                                />
                            </div>
                        </div>
                     </div>
                 </div>
                 
                 {/* NEON / GLOW EFFECTS */}
                 <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                     <div className="flex items-center justify-between mb-2">
                        <Label>Effects (Neon & Shadow)</Label>
                        <button 
                            onClick={removeGlow}
                            className="text-[9px] text-slate-400 hover:text-red-500"
                            title="Remove Effects"
                        >
                            Reset
                        </button>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mb-2">
                         <ColorPicker label="Glow Color" value={glowColor} onChange={setGlowColor} />
                         <NumberInput label="Blur (px)" value={glowBlur} onChange={setGlowBlur} min={0} max={100} />
                     </div>
                     <button 
                         onClick={applyGlow}
                         className="w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                     >
                         Apply Glow / Shadow
                     </button>
                 </div>

                 {/* Glassmorphism Controls */}
                 <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                     <div className="flex items-center justify-between mb-3">
                        <Label>{t.glassEffect}</Label>
                        <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggleGlass" 
                                id="toggleGlass"
                                checked={glass.enabled}
                                onChange={(e) => handleGlassChange({ enabled: e.target.checked })}
                                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer checked:right-0 right-4"
                            />
                            <label htmlFor="toggleGlass" className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${glass.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
                        </div>
                     </div>
                     
                     {glass.enabled && (
                         <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
                             <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500">{t.blur}</span>
                                    <span className="text-[10px] text-slate-700 font-bold">{glass.blur}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={glass.blur}
                                    onChange={(e) => handleGlassChange({ blur: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                             <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500">{t.glassOpacity}</span>
                                    <span className="text-[10px] text-slate-700 font-bold">{glass.opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={glass.opacity}
                                    onChange={(e) => handleGlassChange({ opacity: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                             </div>
                         </div>
                     )}
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label>{t.opacity}</Label>
                        <span className="text-[10px] text-slate-600 font-bold">{Math.round((parseFloat(selectedElement.style.opacity?.toString() || '1') * 100))}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(parseFloat(selectedElement.style.opacity?.toString() || '1') * 100)}
                        onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value) / 100)}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </div>

            {/* Conditional Formatting */}
            {(selectedElement.type === 'text' || selectedElement.type === 'progress-bar' || selectedElement.type === 'icon' || selectedElement.type === 'circular-progress') && (
                <div>
                     <hr className="border-slate-100 my-4" />
                     <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
                         <div className="flex items-center"><span className="material-symbols-outlined text-base mr-1.5 text-blue-600">rule</span> {t.conditionalLogic}</div>
                         <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">{selectedElement.conditionalFormatting?.length || 0}</span>
                     </h3>
                     <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-3">
                         {/* Rule Input UI */}
                        <div className="flex space-x-2 mb-2">
                             <select className="flex-1 text-[10px] border border-slate-200 rounded-lg bg-white p-1.5 text-slate-700 font-medium outline-none focus:border-blue-500" value={newRule.operator} onChange={(e) => setNewRule({...newRule, operator: e.target.value as any})}>
                                 <option>{'>'}</option><option>{'<'}</option><option>{'='}</option>
                             </select>
                             <input type="number" className="w-14 text-[10px] border border-slate-200 rounded-lg p-1.5 text-center bg-white text-slate-700 font-medium outline-none focus:border-blue-500" value={newRule.value} onChange={(e) => setNewRule({...newRule, value: parseFloat(e.target.value)})} />
                             <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                <input type="color" className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0" value={newRule.outputColor} onChange={(e) => setNewRule({...newRule, outputColor: e.target.value})} />
                             </div>
                        </div>
                        <button onClick={addConditionalRule} className="w-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex justify-center items-center">
                            <span className="material-symbols-outlined text-sm mr-1">add</span> {t.addRule}
                        </button>
                     </div>
                     <div className="space-y-2">
                         {selectedElement.conditionalFormatting?.map(rule => (
                             <div key={rule.id} className="flex items-center justify-between text-xs bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                                 <span className="font-mono text-slate-600 font-bold ml-1">{rule.operator} {rule.value}</span>
                                 <div className="flex items-center space-x-3">
                                     <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{backgroundColor: rule.outputColor}}></div>
                                     <button onClick={() => removeConditionalRule(rule.id)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-base">close</span></button>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 z-20 shadow-xl">
        <style>{PREVIEW_STYLES}</style>
        
        {/* TABS */}
        <div className="flex border-b border-slate-100 bg-white">
           {(['properties', 'animations', 'layers'] as const).map(tab => (
               <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-blue-600 bg-slate-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
               >
                   {tab === 'properties' ? t.properties : tab === 'animations' ? t.animations : t.layers}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
               </button>
           ))}
       </div>

       {/* CONTENT */}
       <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
           
           {activeTab === 'layers' && (
               <LayersPanel 
                   elements={elements} 
                   selectedId={selectedElement?.id || null} 
                   onSelect={onSelect} 
                   onReorder={onReorder} 
                   onDelete={onDelete} 
                   t={t} 
               />
           )}

           {activeTab === 'properties' && (
               <>
                   {!selectedElement ? (
                       <>
                           <div className="p-4 bg-blue-50 border-b border-blue-100">
                               <h3 className="text-xs font-bold text-blue-600 flex items-center">
                                   <span className="material-symbols-outlined text-base mr-2">settings</span>
                                   {t.canvasSettings}
                               </h3>
                           </div>
                           {renderCanvasSettings()}
                       </>
                   ) : (
                       <>
                           <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                               <div className="flex items-center">
                                   <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">
                                       {selectedElement.type === 'text' ? 'title' : selectedElement.type === 'box' ? 'check_box_outline_blank' : selectedElement.type === 'image' ? 'image' : 'star'}
                                   </span>
                                   <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{selectedElement.name}</span>
                               </div>
                               <button onClick={() => onDelete(selectedElement.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Element">
                                   <span className="material-symbols-outlined text-lg">delete</span>
                               </button>
                           </div>
                           {renderElementProperties()}
                       </>
                   )}
               </>
           )}

           {activeTab === 'animations' && (
               <div className="p-5">
                   {!selectedElement ? (
                       <div className="text-center py-10 text-slate-400">
                           <span className="material-symbols-outlined text-3xl mb-2">animation</span>
                           <p className="text-xs">{t.noSelection}</p>
                       </div>
                   ) : (
                       <div className="space-y-6">
                           <AnimationControl 
                               title={t.entryAnimation} 
                               config={selectedElement.animation?.entry || { type: 'none', duration: 0.5, delay: 0, easing: 'ease-out', intensity: 50 }} 
                               onChange={(cfg) => handleAnimationChange('entry', cfg)} 
                               types={['none', 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'bounce', 'spin']}
                           />

                           <AnimationControl 
                               title={t.hoverEffect} 
                               config={selectedElement.animation?.hover || { type: 'none', duration: 0.3, delay: 0, easing: 'ease', intensity: 50 }} 
                               onChange={(cfg) => handleAnimationChange('hover', cfg)} 
                               types={['none', 'scale', 'slide-up', 'slide-right', 'rotate']}
                           />
                           
                           <AnimationControl 
                               title="Idle / Loop" 
                               config={selectedElement.animation?.idle || { type: 'none', duration: 2, delay: 0, easing: 'linear', intensity: 50, infinite: true }} 
                               onChange={(cfg) => handleAnimationChange('idle', cfg)} 
                               types={['none', 'float', 'breathing', 'heartbeat', 'shimmer', 'shake', 'wiggle', 'pulse', 'spin']} 
                               isIdle
                           />
                       </div>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};

export default PropertiesPanel;