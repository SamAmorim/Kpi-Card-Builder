import React, { useEffect, useState, useRef } from 'react';
import { TEMPLATES, TRANSLATIONS } from '../../constants';
import { CinematicCard } from './CinematicCard';
import { FakeLanding } from './FakeLanding';
import { FakeTemplateSelector } from './FakeTemplateSelector';
import { FakeEditor } from './FakeEditor';
import { ScriptAction, DemoStage } from './types';
import { SoundManager } from './SoundManager';

interface DemoOverlayProps {
    onExit: () => void;
}

export const DemoOverlay: React.FC<DemoOverlayProps> = ({ onExit }) => {
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    const [stage, setStage] = useState<DemoStage>('landing');
    
    // UI State
    const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
    const [accentColor, setAccentColor] = useState('#10b981'); // Start Green (Matches Template)
    const [isSpotlight, setIsSpotlight] = useState(false);
    const [flash, setFlash] = useState(false);
    
    // New Interaction States
    const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});
    
    // Refs
    const soundRef = useRef<SoundManager | null>(null);
    const reqRef = useRef<number>(0);
    const scriptIndexRef = useRef<number>(0);
    const lastActionTimeRef = useRef<number>(0);

    // FIX: Find specific template by ID instead of hardcoded index [7] which shifts
    const template = TEMPLATES.find(t => t.id === 'revenue-trend') || TEMPLATES[0]; 

    useEffect(() => {
        setDimensions({ w: window.innerWidth, h: window.innerHeight });
        soundRef.current = new SoundManager();

        const resize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', resize);
        
        startScript();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(reqRef.current);
            soundRef.current?.stopAll();
        };
    }, []);

    // SCRIPT DEFINITION
    const SCRIPT: ScriptAction[] = [
        // 1. TELA INICIAL
        { type: 'set-stage', stage: 'landing' },
        { type: 'wait', duration: 800 },
        
        { type: 'set-prop', propKey: 'target', propValue: 'btn-launch' },
        { type: 'wait', duration: 800 },
        { type: 'play-sound', soundName: 'click' },
        { type: 'set-prop', propKey: 'target', propValue: null },
        
        { type: 'flash', duration: 300 },
        
        // 2. SELEÇÃO DE TEMPLATE
        { type: 'set-stage', stage: 'templates' },
        { type: 'wait', duration: 800 },
        
        { type: 'set-prop', propKey: 'target', propValue: 'tpl-revenue-trend' },
        { type: 'wait', duration: 1000 },
        { type: 'play-sound', soundName: 'click' },
        { type: 'set-prop', propKey: 'target', propValue: null },

        { type: 'flash', duration: 300 },

        // 3. EDITOR
        { type: 'set-stage', stage: 'editor' },
        { type: 'wait', duration: 1000 },

        // -- ACTION: CHANGE TEXT (Title) --
        // Highlight content input
        { type: 'set-prop', propKey: 'target', propValue: 'prop-content-input' }, 
        { type: 'wait', duration: 600 },
        // Simulate typing "Monthly Revenue" into the label (ID: rt-label)
        { type: 'type-text', targetId: 'rt-label', text: 'Monthly Revenue', duration: 800 },
        { type: 'wait', duration: 400 },
        { type: 'set-prop', propKey: 'target', propValue: null },

        // -- ACTION: CHANGE TEXT (Value) --
        // Highlight content input again (conceptually we selected the value element)
        { type: 'set-prop', propKey: 'target', propValue: 'prop-content-input' },
        { type: 'wait', duration: 400 },
        // Simulate typing value into rt-val
        { type: 'type-text', targetId: 'rt-val', text: '$142.5k', duration: 600 },
        { type: 'wait', duration: 400 },
        { type: 'set-prop', propKey: 'target', propValue: null },

        // -- ACTION: CHANGE COLORS --
        { type: 'set-prop', propKey: 'target', propValue: 'color-#8b5cf6' },
        { type: 'wait', duration: 600 },
        { type: 'play-sound', soundName: 'click' },
        { type: 'set-prop', propKey: 'color', propValue: '#8b5cf6' }, // Change to Purple
        { type: 'set-prop', propKey: 'target', propValue: null },
        { type: 'wait', duration: 800 },

        { type: 'set-prop', propKey: 'target', propValue: 'color-#3b82f6' },
        { type: 'wait', duration: 600 },
        { type: 'play-sound', soundName: 'click' },
        { type: 'set-prop', propKey: 'color', propValue: '#3b82f6' }, // Change to Blue
        { type: 'set-prop', propKey: 'target', propValue: null },
        { type: 'wait', duration: 800 },

        // -- ACTION: EXPORT --
        { type: 'set-prop', propKey: 'target', propValue: 'btn-export' },
        { type: 'wait', duration: 1000 },
        { type: 'play-sound', soundName: 'click' },
        { type: 'set-prop', propKey: 'target', propValue: null },
        
        // -- FINALE: ASCENSION (Float up into black) --
        { type: 'flash', duration: 100 },
        { type: 'set-prop', propKey: 'spotlight', propValue: true },
        { type: 'play-sound', soundName: 'whoosh' }, 
        { type: 'wait', duration: 5000 },
        
        { type: 'set-stage', stage: 'outro' },
    ];

    const startScript = () => {
        lastActionTimeRef.current = performance.now();
        requestAnimationFrame(tick);
    };

    const tick = (time: number) => {
        if (scriptIndexRef.current >= SCRIPT.length) {
            if (stage === 'outro') onExit();
            return;
        }

        const action = SCRIPT[scriptIndexRef.current];
        const elapsedInAction = time - lastActionTimeRef.current;

        if (action.type === 'wait') {
            if (elapsedInAction >= (action.duration || 500)) {
                lastActionTimeRef.current = time;
                scriptIndexRef.current++;
            }
        }
        else if (action.type === 'play-sound') {
            if (action.soundName === 'click') soundRef.current?.play('click');
            if (action.soundName === 'whoosh') soundRef.current?.play('whoosh');
            lastActionTimeRef.current = time;
            scriptIndexRef.current++;
        }
        else if (action.type === 'flash') {
            if (elapsedInAction === 0) setFlash(true);
            if (elapsedInAction >= (action.duration || 200)) {
                setFlash(false);
                lastActionTimeRef.current = time;
                scriptIndexRef.current++;
            }
        }
        else if (action.type === 'set-stage') {
            setStage(action.stage!);
            lastActionTimeRef.current = time;
            scriptIndexRef.current++;
        }
        else if (action.type === 'set-prop') {
            if (action.propKey === 'spotlight') setIsSpotlight(action.propValue);
            if (action.propKey === 'target') setActiveTargetId(action.propValue);
            if (action.propKey === 'color') setAccentColor(action.propValue);
            lastActionTimeRef.current = time;
            scriptIndexRef.current++;
        }
        else if (action.type === 'type-text') {
            // Typing logic
            if (action.text && action.targetId) {
                const duration = action.duration || 1000;
                const progress = Math.min(elapsedInAction / duration, 1);
                const charCount = Math.floor(progress * action.text.length);
                const currentText = action.text.substring(0, charCount);
                
                setTextOverrides(prev => ({
                    ...prev,
                    [action.targetId!]: currentText
                }));

                if (progress >= 1) {
                    lastActionTimeRef.current = time;
                    scriptIndexRef.current++;
                }
            } else {
                 scriptIndexRef.current++;
            }
        }
        else {
             lastActionTimeRef.current = time;
             scriptIndexRef.current++;
        }

        reqRef.current = requestAnimationFrame(tick);
    };

    return (
        <div className="fixed inset-0 z-[9000] bg-black cursor-none overflow-hidden font-sans text-white">
            
            <div className={`fixed inset-0 bg-white pointer-events-none z-[9999] transition-opacity duration-300 ease-out ${flash ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className={`absolute inset-0 transition-opacity duration-500 ${stage === 'landing' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <FakeLanding t={TRANSLATIONS.en} activeTargetId={activeTargetId} />
            </div>

            <div className={`absolute inset-0 transition-opacity duration-500 ${stage === 'templates' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <FakeTemplateSelector activeTargetId={activeTargetId} />
            </div>

            <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out 
                ${(stage === 'editor' || stage === 'void') ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="w-full h-full relative bg-gray-50 overflow-hidden">
                    
                    {/* Dark Void Background for Ascension */}
                    <div className={`absolute inset-0 bg-[#050505] z-40 transition-opacity duration-[1500ms] ${isSpotlight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]"></div>
                    </div>

                    {/* Fake Editor UI - Fades out during ascension */}
                    <div className={`absolute inset-0 transition-all duration-1000 ${isSpotlight ? 'opacity-0 scale-95 blur-sm' : 'opacity-100'}`}>
                        <FakeEditor t={TRANSLATIONS.en} activeTargetId={activeTargetId} accentColor={accentColor} textOverrides={textOverrides}>
                            <div className="w-full h-full"></div>
                        </FakeEditor>
                    </div>

                    {/* THE HERO CARD - Center Stage */}
                    <div 
                        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-[2000ms] cubic-bezier(0.2, 0.8, 0.2, 1)`}
                        style={{
                            // If spotlight (ascension), center it. If editor, offset it to the canvas area.
                            paddingLeft: isSpotlight ? '0px' : '192px', 
                            paddingRight: isSpotlight ? '0px' : '320px',
                            // Ascension Transform: Move UP, Scale UP, Rotate
                            // UPGRADED: translate -100px (was -50px), scale 1.6 (was 1.5)
                            transform: isSpotlight ? 'translateY(-100px) scale(1.6) rotateY(360deg)' : 'translateY(0) scale(1) rotateY(0deg)',
                            zIndex: isSpotlight ? 100 : 50
                        }}
                    >
                        <div className={`relative transition-all duration-1000 ${isSpotlight ? 'drop-shadow-[0_0_100px_rgba(59,130,246,0.6)]' : ''}`}>
                            <CinematicCard 
                                elements={template.elements}
                                settings={template.canvasSettings}
                                mouseX={0}
                                mouseY={0}
                                containerWidth={dimensions.w}
                                containerHeight={dimensions.h}
                                accentColor={accentColor}
                                inEditorMode={true} 
                                textOverrides={textOverrides}
                            />

                            {/* Success Badge - WIDER & LOWER */}
                            <div className={`absolute -bottom-48 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-700 delay-1000 ${isSpotlight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="bg-green-500 text-white px-12 py-5 rounded-full font-bold text-2xl flex items-center shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-bounce min-w-[350px] justify-center whitespace-nowrap">
                                    <span className="material-symbols-outlined mr-4 text-4xl">check_circle</span>
                                    <div className="text-left">
                                        <div className="text-xs text-green-100 uppercase tracking-widest font-mono mb-1">Output Generated</div>
                                        <div>Ready for Power BI</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <div className="absolute bottom-8 left-8 text-[9px] font-mono text-gray-400 px-2 py-1 z-[9999] opacity-30">
                DEMO MODE // {stage.toUpperCase()}
            </div>
        </div>
    );
};