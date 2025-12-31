import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Language, ProjectState, CanvasElement, Template, CanvasSettings, ToastMessage } from './types';
import { TRANSLATIONS, TEMPLATES } from './constants';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import TemplateSelector from './components/TemplateSelector';
import Toast from './components/Toast';
import ShortcutsModal from './components/ShortcutsModal';
import { generateCode } from './services/codeGenerator';
import MiniPreview from './components/MiniPreview';
import LandingDemoSection from './components/LandingDemoSection';
import { DemoTrigger } from './components/demo/DemoTrigger';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'template-selection' | 'editor'>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [exportType, setExportType] = useState<'dax' | 'html'>('dax');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Animation State
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Mouse Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [project, setProject] = useState<ProjectState>({
    elements: [],
    selectedIds: [], // UPDATED: Array
    canvasSettings: {
      width: 400,
      height: 300,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderStyle: 'solid',
      showShadow: true
    }
  });

  // History State
  const [historyPast, setHistoryPast] = useState<ProjectState[]>([]);
  const [historyFuture, setHistoryFuture] = useState<ProjectState[]>([]);

  // REFS FOR SHORTCUTS (To avoid stale closures in event listeners)
  const projectRef = useRef(project);
  const historyPastRef = useRef(historyPast);
  const historyFutureRef = useRef(historyFuture);

  useEffect(() => {
      projectRef.current = project;
      historyPastRef.current = historyPast;
      historyFutureRef.current = historyFuture;
  }, [project, historyPast, historyFuture]);

  const t = TRANSLATIONS[lang];

  // --- HELPERS ---
  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
      const id = uuidv4();
      setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Important: saveToHistory captures the CURRENT project state before modifications
  const saveToHistory = useCallback(() => {
      setHistoryPast(prev => {
          const newHistory = [...prev, project];
          if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
          return newHistory;
      });
      setHistoryFuture([]);
  }, [project]);

  const undo = useCallback(() => {
      if (historyPast.length === 0) return;
      const previous = historyPast[historyPast.length - 1];
      const newPast = historyPast.slice(0, historyPast.length - 1);
      
      setHistoryFuture(prev => [project, ...prev]);
      setProject(previous);
      setHistoryPast(newPast);
      addToast(t.undo, 'info');
  }, [historyPast, project, t.undo]);

  const redo = useCallback(() => {
      if (historyFuture.length === 0) return;
      const next = historyFuture[0];
      const newFuture = historyFuture.slice(1);

      setHistoryPast(prev => [...prev, project]);
      setProject(next);
      setHistoryFuture(newFuture);
      addToast(t.redo, 'info');
  }, [historyFuture, project, t.redo]);

  // --- PARALLAX HANDLER ---
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (view !== 'landing') return;
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Calculate refined offset (dampened)
      setMousePos({
          x: (clientX - centerX) / 40,
          y: (clientY - centerY) / 40
      });
  }, [view]);

  // --- ACTIONS ---

  // Enhanced addElement to support specific shape presets
  const addElement = (type: CanvasElement['type'], variant?: 'rectangle' | 'circle' | 'rounded') => {
    saveToHistory();
    let newElement: CanvasElement = {
      id: uuidv4(),
      type,
      name: `${type}${project.elements.length + 1}`,
      style: {
        position: 'absolute',
        left: 20,
        top: 20,
        zIndex: project.elements.length + 1,
      },
      // Default empty animation settings
      animation: {
          entry: { type: 'none', duration: 0.5, delay: 0, easing: 'ease-out', intensity: 50 },
          hover: { type: 'none', duration: 0.3, delay: 0, easing: 'ease', intensity: 50 },
          idle: { type: 'none', duration: 2, delay: 0, easing: 'linear', intensity: 50, infinite: true }
      }
    };

    // Default styles per type
    if (type === 'text') {
      newElement.style = { ...newElement.style, width: 150, height: 40, color: '#0f172a', fontSize: 16, fontFamily: 'Inter, sans-serif' };
      newElement.content = 'Sample Text';
    } 
    else if (type === 'box') {
      const size = 100;
      let borderRadius = 0;
      if (variant === 'circle') borderRadius = 999;
      if (variant === 'rounded') borderRadius = 12;
      
      newElement.style = { 
          ...newElement.style, 
          width: size, 
          height: size, 
          backgroundColor: '#f1f5f9', 
          borderRadius: borderRadius 
      };
      if (variant) newElement.name = variant.charAt(0).toUpperCase() + variant.slice(1);
    } 
    else if (type === 'icon') {
      newElement.style = { ...newElement.style, width: 50, height: 50, color: '#64748b', fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' };
      newElement.content = 'star';
    } 
    else if (type === 'image') {
      newElement.style = { ...newElement.style, width: 80, height: 80, borderRadius: 8 };
      newElement.chartProps = { imageUrl: 'https://via.placeholder.com/150' };
    } 
    else if (type === 'table') {
      newElement.style = { ...newElement.style, width: 320, height: 160, backgroundColor: '#ffffff', borderRadius: 8 };
      newElement.tableProps = {
          columns: [
              { id: uuidv4(), header: 'Category', width: 40, dataBinding: '[Category]' },
              { id: uuidv4(), header: 'Value', width: 30, dataBinding: '[Value]' },
              { id: uuidv4(), header: 'YoY', width: 30, dataBinding: '[YoY %]' }
          ],
          rowHeight: 32,
          headerColor: '#64748b',
          headerBgColor: '#f8fafc',
          rowColor: '#334155',
          rowBgColor: '#ffffff',
          gridColor: '#e2e8f0'
      };
    }
    else if (type === 'progress-bar') {
      newElement.style = { ...newElement.style, width: 200, height: 10, borderRadius: 5 };
      newElement.chartProps = { value: 50, color: '#3b82f6', backgroundColor: '#e2e8f0' };
    } 
    else if (type === 'circular-progress') {
      newElement.style = { ...newElement.style, width: 80, height: 80 };
      newElement.chartProps = { value: 75, color: '#3b82f6', backgroundColor: '#e2e8f0', strokeWidth: 8 };
    } 
    else if (type === 'sparkline') {
      newElement.style = { ...newElement.style, width: 150, height: 50 };
      newElement.chartProps = { dataPoints: [10, 20, 15, 25, 18, 30], color: '#3b82f6', strokeWidth: 2 };
    } 
    else if (type === 'area-chart') {
      newElement.style = { ...newElement.style, width: 150, height: 60 };
      newElement.chartProps = { 
        dataPoints: [10, 25, 20, 40, 30, 50, 45], 
        color: '#3b82f6', 
        backgroundColor: '#dbeafe', 
        strokeWidth: 2 
      };
    } 
    else if (type === 'bar-chart') {
      newElement.style = { ...newElement.style, width: 200, height: 120, color: '#64748b' };
      newElement.chartProps = { 
          dataPoints: [45, 70, 30, 85, 55], 
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          color: '#3b82f6', 
          backgroundColor: '#e2e8f0'
      };
    } 
    else if (type === 'column-chart') {
      newElement.style = { ...newElement.style, width: 200, height: 120, color: '#64748b' };
      newElement.chartProps = { 
          dataPoints: [30, 50, 40, 70, 55, 80], 
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          color: '#3b82f6',
          backgroundColor: '#e2e8f0'
      };
    }

    setProject(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedIds: [newElement.id] // Auto select new
    }));
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setProject(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  };

  const updateElementWithHistory = (id: string, updates: Partial<CanvasElement>) => {
      saveToHistory();
      updateElement(id, updates);
  };

  const updateCanvas = (updates: Partial<CanvasSettings>) => {
    saveToHistory();
    setProject(prev => ({
      ...prev,
      canvasSettings: { ...prev.canvasSettings, ...updates }
    }));
  };

  const deleteElement = useCallback((id: string) => {
    saveToHistory();
    setProject(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedIds: prev.selectedIds.filter(sid => sid !== id)
    }));
    addToast(t.deleted, 'success');
  }, [t.deleted, project, saveToHistory]);

  const reorderElement = (draggedId: string, targetId: string) => {
    saveToHistory();
    setProject(prev => {
      const newElements = [...prev.elements];
      const draggedIndex = newElements.findIndex(el => el.id === draggedId);
      const targetIndex = newElements.findIndex(el => el.id === targetId);
      
      if (draggedIndex < 0 || targetIndex < 0) return prev;

      const [movedItem] = newElements.splice(draggedIndex, 1);
      newElements.splice(targetIndex, 0, movedItem);

      const reindexed = newElements.map((el, idx) => ({
          ...el,
          style: { ...el.style, zIndex: idx + 1 }
      }));

      return {
          ...prev,
          elements: reindexed
      };
    });
  };

  const handleTemplateSelection = (template: Template | null) => {
      if (template) {
          const newElements = template.elements.map(el => ({
            ...el,
            id: uuidv4()
          }));
          setProject({
            elements: newElements,
            selectedIds: [],
            canvasSettings: { ...template.canvasSettings }
          });
      } else {
          // Scratch
          setProject({
            elements: [],
            selectedIds: [],
            canvasSettings: { 
                width: 400, 
                height: 300, 
                backgroundColor: 'transparent',
                borderRadius: 0, 
                borderColor: '#e2e8f0', 
                borderWidth: 0,
                borderStyle: 'solid',
                showShadow: false 
            }
          });
      }
      setHistoryPast([]);
      setHistoryFuture([]);
      setView('editor');
  };

  // --- SHORTCUTS IMPLEMENTATION ---
  useEffect(() => {
      const handleGlobalKeys = (e: KeyboardEvent) => {
          const target = e.target as HTMLElement;
          const isInput = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable;

          const currentProject = projectRef.current;
          const past = historyPastRef.current;
          const future = historyFutureRef.current;

          // Undo / Redo
          if ((e.ctrlKey || e.metaKey)) {
              const key = e.key.toLowerCase();
              if (key === 'z') {
                  if (e.shiftKey) { 
                      // Redo Logic
                      if (!isInput && future.length > 0) { 
                          e.preventDefault(); 
                          const next = future[0];
                          const newFuture = future.slice(1);
                          setHistoryPast(prev => [...prev, currentProject]);
                          setProject(next);
                          setHistoryFuture(newFuture);
                          addToast(t.redo, 'info');
                      } 
                  } else { 
                      // Undo Logic
                      if (!isInput && past.length > 0) { 
                          e.preventDefault(); 
                          const previous = past[past.length - 1];
                          const newPast = past.slice(0, past.length - 1);
                          setHistoryFuture(prev => [currentProject, ...prev]);
                          setProject(previous);
                          setHistoryPast(newPast);
                          addToast(t.undo, 'info');
                      } 
                  }
              }
              if (key === 'y') { 
                  // Redo Logic
                  if (!isInput && future.length > 0) { 
                      e.preventDefault(); 
                      const next = future[0];
                      const newFuture = future.slice(1);
                      setHistoryPast(prev => [...prev, currentProject]);
                      setProject(next);
                      setHistoryFuture(newFuture);
                      addToast(t.redo, 'info');
                  } 
              }
          }

          // Delete
          if (e.key === 'Delete' || e.key === 'Backspace') {
              if (currentProject.selectedIds.length > 0 && !isInput) { 
                  e.preventDefault();
                  // Save History
                  setHistoryPast(prev => {
                      const newHistory = [...prev, currentProject];
                      if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
                      return newHistory;
                  });
                  setHistoryFuture([]); 
                  
                  // Delete ALL selected
                  setProject(prev => ({
                      ...prev,
                      elements: prev.elements.filter(el => !prev.selectedIds.includes(el.id)),
                      selectedIds: []
                  }));
                  addToast(t.deleted, 'success');
              }
          }

          // Nudge Elements (Arrow Keys)
          if (currentProject.selectedIds.length > 0 && !isInput && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              e.preventDefault();
              
              // Save History
              setHistoryPast(prev => {
                  const newHistory = [...prev, currentProject];
                  if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
                  return newHistory;
              });
              setHistoryFuture([]); // Clear redo on new action

              const step = e.shiftKey ? 10 : 1;
              const dx = (e.key === 'ArrowLeft' ? -step : (e.key === 'ArrowRight' ? step : 0));
              const dy = (e.key === 'ArrowUp' ? -step : (e.key === 'ArrowDown' ? step : 0));
              
              setProject(prev => ({
                  ...prev,
                  elements: prev.elements.map(item => {
                      if (prev.selectedIds.includes(item.id)) {
                          const currentLeft = parseInt(item.style.left?.toString() || '0');
                          const currentTop = parseInt(item.style.top?.toString() || '0');
                          return { ...item, style: { ...item.style, left: currentLeft + dx, top: currentTop + dy } };
                      }
                      return item;
                  })
              }));
          }
      };

      window.addEventListener('keydown', handleGlobalKeys);
      return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [t]); 

  const generatedCode = generateCode(project.elements, project.canvasSettings);

  const CodeModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-3/4 max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-green-600">code</span>
              <h3 className="text-lg font-bold text-gray-800">{t.generatedCode}</h3>
          </div>
          <div className="flex space-x-2 items-center">
             <div className="flex bg-gray-200 rounded-lg p-1">
                <button onClick={() => setExportType('dax')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${exportType === 'dax' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>DAX</button>
                <button onClick={() => setExportType('html')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${exportType === 'html' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>HTML</button>
             </div>
             <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors ml-4"><span className="material-symbols-outlined">close</span></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-[#1e1e1e] text-blue-100 font-mono text-xs leading-relaxed custom-scrollbar shadow-inner">
          <pre className="whitespace-pre-wrap selection:bg-blue-500 selection:text-white">{exportType === 'dax' ? generatedCode.dax : generatedCode.html}</pre>
        </div>
        <div className="p-4 border-t bg-white flex justify-end">
          <button onClick={() => { navigator.clipboard.writeText(exportType === 'dax' ? generatedCode.dax : generatedCode.html); addToast(t.copy, 'success'); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/30 transition-all active:scale-95 font-semibold">
            <span className="material-symbols-outlined mr-2 text-lg">content_copy</span>{t.copy}
          </button>
        </div>
      </div>
    </div>
  );

  const ToolButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full h-12 mb-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 flex items-center px-4 text-slate-500 hover:text-blue-600 transition-all shadow-sm group hover:shadow-md">
        <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-blue-100">
             <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">{label}</span>
    </button>
  );

  const ShapeButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group">
         <span className="material-symbols-outlined text-slate-500 group-hover:text-blue-600 mb-1">{icon}</span>
         <span className="text-[9px] font-bold text-slate-400 group-hover:text-blue-700">{label}</span>
    </button>
  );

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans ${view === 'editor' ? 'bg-gray-50 text-gray-900' : 'bg-transparent text-white'}`}>
      <DemoTrigger />
      <Toast toasts={toasts} removeToast={removeToast} />
      {showExportModal && <CodeModal />}
      {showHelpModal && <ShortcutsModal onClose={() => setShowHelpModal(false)} t={t} />}
      
      {/* Editor Header - Only visible in Editor Mode */}
      {view === 'editor' && (
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-30 relative shadow-md">
            <div className="flex items-center">
            <button onClick={() => setView('template-selection')} className="text-gray-400 hover:text-white transition-colors mr-4 bg-white/5 p-2 rounded-lg border border-white/5 hover:border-white/20" title="Back to Templates">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="h-8 w-px bg-white/10 mr-4"></div>
            <h1 className="font-bold text-lg text-white flex items-center tracking-tight">
                <span className="material-symbols-outlined mr-2 text-blue-500">dashboard_customize</span>
                {t.editorTitle}
            </h1>
            </div>
            
            <div className="flex items-center space-x-3">
            <button 
                onClick={() => setAnimationTrigger(prev => prev + 1)}
                className="bg-white/5 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 flex items-center border border-white/10 transition-all"
                title="Replay Animations"
            >
                <span className="material-symbols-outlined text-lg mr-2">play_arrow</span>Play
            </button>
            
            <div className="w-px h-8 bg-white/10 mx-1"></div>

            <div className="flex mr-2 bg-white/5 rounded-xl p-1 border border-white/5">
                <button onClick={() => setShowHelpModal(true)} className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg" title="Keyboard Shortcuts">
                    <span className="material-symbols-outlined text-xl">keyboard</span>
                </button>
                <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
                <button onClick={undo} disabled={historyPast.length === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors hover:bg-white/10 rounded-lg" title="Undo (Ctrl+Z)">
                    <span className="material-symbols-outlined text-xl">undo</span>
                </button>
                <button onClick={redo} disabled={historyFuture.length === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors hover:bg-white/10 rounded-lg" title="Redo (Ctrl+Y)">
                    <span className="material-symbols-outlined text-xl">redo</span>
                </button>
            </div>
            <button onClick={() => setShowExportModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-500 flex items-center shadow-lg shadow-blue-900/50 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <span className="material-symbols-outlined text-[20px] mr-2">code</span>{t.export}
            </button>
            </div>
        </header>
      )}
      
      {/* LANDING PAGE - (Omitting long content for brevity, assumed unchanged) */}
      {view === 'landing' ? (
        <div 
            className="h-full w-full overflow-y-auto overflow-x-hidden bg-transparent text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white relative scroll-smooth"
            onMouseMove={handleMouseMove}
        >
        {/* ... Landing Content (See previous App.tsx for full content) ... */}
        {/* Note: The Canvas is in index.html as fixed layer 0 */}
        <div className="fixed inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent z-0 pointer-events-none opacity-80"></div>
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
           <div className="font-extrabold text-xl tracking-tighter flex items-center text-white/90">
             <div className="w-8 h-8 rounded bg-white flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <span className="material-symbols-outlined text-black text-lg">dashboard</span>
             </div>
             KPI Card Builder <span className="text-[10px] ml-2 px-2 py-0.5 border border-white/20 rounded-full font-mono text-gray-400">BETA b1.0</span>
           </div>
           <button onClick={() => setLang(lang === 'en' ? 'pt' : 'en')} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-full hover:border-white/30 transition-all bg-black/50 backdrop-blur-md">
             {lang === 'en' ? 'EN' : 'PT'}
           </button>
        </nav>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 max-w-7xl mx-auto w-full text-center">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[500px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20 blur-sm"></div>
           <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-blue-400 rounded-full text-[10px] font-mono mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
             <span>DAX GENERATOR ENGINE ACTIVE</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95] drop-shadow-2xl animate-in fade-in zoom-in-95 duration-700">
             {t.heroTitleStart} <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{t.heroTitleEnd}</span>
           </h1>
           <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
             {t.heroSubtitle}
           </p>
           <div className="flex flex-col md:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
               <button onClick={() => setView('template-selection')} className="group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-200 overflow-hidden">
                 <span className="relative z-10 flex items-center">{t.ctaStart} <span className="material-symbols-outlined ml-2 text-lg transition-transform group-hover:translate-x-1">arrow_forward</span></span>
               </button>
           </div>
           <div className="absolute bottom-8 right-12 animate-bounce flex flex-col items-center gap-2 z-20 pointer-events-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-lg shadow-blue-900/20">Scroll to Explore</span>
                <span className="material-symbols-outlined text-blue-400 text-2xl drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">keyboard_arrow_down</span>
           </div>
        </div>
        <div className="relative w-full max-w-6xl mx-auto h-[400px] perspective-1000 hidden md:block mt-10 z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
             <div className="absolute top-10 left-20 w-[280px] hover:z-20 hover:scale-110 transition-all duration-500 transform rotate-y-12 rotate-z-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 rounded-xl overflow-hidden" style={{ transform: `translateX(${-mousePos.x * 0.5}px) translateY(${-mousePos.y * 0.5}px) rotateY(12deg) rotateZ(6deg)` }}>
                 <MiniPreview elements={TEMPLATES[5].elements} settings={TEMPLATES[5].canvasSettings} />
             </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] z-10 hover:scale-110 transition-all duration-500 shadow-[0_0_80px_rgba(59,130,246,0.3)] border border-white/10 rounded-2xl overflow-hidden" style={{ transform: `translateX(${mousePos.x}px) translateY(${mousePos.y}px)` }}>
                 <MiniPreview elements={TEMPLATES[7].elements} settings={TEMPLATES[7].canvasSettings} />
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-[beam-scan_3s_linear_infinite]"></div>
             </div>
             <div className="absolute top-20 right-20 w-[280px] hover:z-20 hover:scale-110 transition-all duration-500 transform -rotate-y-12 -rotate-z-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 rounded-xl overflow-hidden" style={{ transform: `translateX(${-mousePos.x * 0.8}px) translateY(${-mousePos.y * 0.8}px) rotateY(-12deg) rotateZ(-6deg)` }}>
                 <MiniPreview elements={TEMPLATES[6].elements} settings={TEMPLATES[6].canvasSettings} />
             </div>
        </div>
        <div className="w-full border-y border-white/5 bg-black/50 backdrop-blur-sm py-16 mt-20 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                {[{ title: t.feature1Title, desc: t.feature1Desc, icon: "html", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },{ title: t.feature2Title, desc: t.feature2Desc, icon: "layers_clear", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },{ title: t.feature3Title, desc: t.feature3Desc, icon: "bolt", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }].map((f, i) => (
                    <div key={i} className={`flex items-start space-x-4 group cursor-default p-4 rounded-2xl border ${f.border} bg-white/5 hover:bg-white/10 transition-all duration-300`}>
                        <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                        </div>
                        <div>
                            <h3 className={`text-white font-bold mb-2 group-hover:${f.color} transition-colors text-lg`}>{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="relative z-10">
             <LandingDemoSection lang={lang} />
        </div>
        <footer className="py-12 text-center relative z-10 border-t border-white/5 bg-[#020204]">
             <a href="https://www.linkedin.com/in/samamorim/" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur text-[10px] text-gray-500 font-mono hover:text-white hover:border-blue-500/30 hover:bg-blue-500/10 transition-all cursor-pointer group">
                 Developed by <span className="text-white font-bold group-hover:text-blue-400 transition-colors">Samuel Amorim</span>
             </a>
        </footer>
      </div>
      ) : view === 'template-selection' ? (
        <TemplateSelector 
            onSelect={handleTemplateSelection}
            onBack={() => setView('landing')}
            hasProject={project.elements.length > 0}
            onResume={() => setView('editor')}
            t={t}
        />
      ) : (
        // EDITOR VIEW
        <div className="flex-1 flex overflow-hidden">
        
            {/* Left Toolbar (Fixed - WIDER & CLEARER - WHITE THEME) */}
            <aside className="w-56 bg-white border-r border-slate-200 flex flex-col p-3 z-20 shrink-0 overflow-y-auto">
                <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic</div>
                <ToolButton icon="title" label="Add Text" onClick={() => addElement('text')} />
                
                {/* Shapes Section */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 mb-2 shadow-sm">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Shapes</div>
                    <div className="flex space-x-1">
                        <ShapeButton icon="check_box_outline_blank" label="Rect" onClick={() => addElement('box', 'rectangle')} />
                        <ShapeButton icon="circle" label="Circle" onClick={() => addElement('box', 'circle')} />
                        <ShapeButton icon="crop_7_5" label="Round" onClick={() => addElement('box', 'rounded')} />
                    </div>
                </div>

                <ToolButton icon="star" label="Add Icon" onClick={() => addElement('icon')} />
                <ToolButton icon="image" label="Add Image" onClick={() => addElement('image')} />
                
                <div className="w-full h-px bg-slate-200 my-4"></div>
                
                <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data</div>
                <ToolButton icon="table_chart" label="Data Grid" onClick={() => addElement('table')} />
                <ToolButton icon="linear_scale" label="Progress" onClick={() => addElement('progress-bar')} />
                <ToolButton icon="data_usage" label="Donut" onClick={() => addElement('circular-progress')} />
                <ToolButton icon="show_chart" label="Sparkline" onClick={() => addElement('sparkline')} />
                <ToolButton icon="area_chart" label="Area Chart" onClick={() => addElement('area-chart')} />
                <ToolButton icon="bar_chart" label="Bar Chart" onClick={() => addElement('bar-chart')} />
                <ToolButton icon="equalizer" label="Column Chart" onClick={() => addElement('column-chart')} />
            </aside>

            {/* Canvas Area (Infinite Pan/Zoom) */}
            <div className="flex-1 relative bg-slate-100 overflow-hidden">
                <Canvas 
                elements={project.elements}
                settings={project.canvasSettings}
                selectedIds={project.selectedIds}
                onSelect={(ids) => setProject(p => ({ ...p, selectedIds: ids }))}
                onUpdate={updateElement}
                onDelete={deleteElement}
                onInteractionStart={saveToHistory}
                emptyStateText={{ title: t.emptyState, desc: t.emptyStateDesc }}
                animationTrigger={animationTrigger}
                />
            </div>

            {/* Right Properties Panel (Fixed) */}
            <PropertiesPanel 
                // Pass the LAST selected element as the primary one for editing
                selectedElement={project.elements.find(el => el.id === project.selectedIds[project.selectedIds.length - 1])}
                selectedIds={project.selectedIds} // NEW PROP
                elements={project.elements}
                canvasSettings={project.canvasSettings}
                onUpdateElement={updateElementWithHistory}
                onUpdateCanvas={updateCanvas}
                onDelete={deleteElement}
                onSelect={(ids) => setProject(p => ({ ...p, selectedIds: ids }))} // UPDATED PROP
                onReorder={reorderElement}
                t={t}
            />
        </div>
      )}
    </div>
  );
};

export default App;