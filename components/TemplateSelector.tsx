import React, { useState } from 'react';
import { Template, Translation, TemplateCategory } from '../types';
import { TEMPLATES } from '../constants';
import MiniPreview from './MiniPreview';

interface TemplateSelectorProps {
  onSelect: (template: Template | null) => void;
  onBack: () => void;
  hasProject: boolean;
  onResume: () => void;
  t: Translation;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onBack, hasProject, onResume, t }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (TemplateCategory | 'All')[] = ['All', 'Executive', 'Analytics', 'Dark UI', 'Grid'];

  // Filter Logic
  const filteredTemplates = TEMPLATES.filter(tpl => {
      const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
      const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#050505] font-sans overflow-hidden text-white relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#1a1a1a_0%,_#050505_40%)] pointer-events-none"></div>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 z-20 backdrop-blur-xl">
          <div className="p-6">
               <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center">
                   <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center mr-3 border border-white/10">
                        <span className="material-symbols-outlined text-white text-lg">dashboard</span>
                   </div>
                   Library
               </h2>
               <p className="text-xs text-gray-500 mt-2 font-medium">Select a starting point.</p>
          </div>

          <div className="px-4 mb-6">
               {hasProject && (
                  <button 
                    onClick={onResume}
                    className="w-full bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between group transition-all mb-4 border border-blue-500/20 hover:border-blue-500/40"
                  >
                      <span>Resume Editing</span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
               )}
               <button onClick={onBack} className="flex items-center text-gray-500 hover:text-white text-xs font-bold px-2 transition-colors uppercase tracking-wider">
                   <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                   Back to Home
               </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Categories</div>
              {categories.map(cat => (
                  <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                          selectedCategory === cat 
                          ? 'bg-white/10 text-white shadow-lg shadow-black/20 border border-white/5' 
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                      }`}
                  >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="material-symbols-outlined text-sm text-blue-500">check_circle</span>}
                  </button>
              ))}
          </div>

          <div className="p-4 border-t border-white/5">
             <div className="bg-[#111] rounded-xl p-4 text-center border border-white/5">
                 <p className="text-[10px] text-gray-500 mb-2">Need inspiration?</p>
                 <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View Documentation</a>
             </div>
          </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                      {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">{filteredTemplates.length} templates available</p>
              </div>
              
              <div className="relative group w-full md:w-80">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors material-symbols-outlined text-lg">search</span>
                  <input 
                      type="text" 
                      placeholder="Search templates..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                  />
              </div>
          </div>

          {/* Start from Scratch Section */}
          {selectedCategory === 'All' && !searchQuery && (
              <div className="mb-12">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Start New</h3>
                  <button 
                    onClick={() => onSelect(null)} 
                    className="w-full md:w-auto flex items-center p-5 bg-[#0a0a0a] border border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-900/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors z-10 border border-white/5">
                        <span className="material-symbols-outlined text-2xl text-gray-400 group-hover:text-blue-400">add</span>
                    </div>
                    <div className="z-10">
                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{t.blankCanvas}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{t.startFromScratch}</p>
                    </div>
                    <span className="ml-auto material-symbols-outlined text-gray-600 group-hover:text-blue-400 transition-colors z-10">arrow_forward</span>
                  </button>
              </div>
          )}

          {/* Grid */}
          <div className="mb-4">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                   {searchQuery ? 'Search Results' : 'Available Designs'}
               </h3>
               
               {filteredTemplates.length === 0 ? (
                   <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10">
                       <span className="material-symbols-outlined text-5xl text-gray-700 mb-4">search_off</span>
                       <p className="text-gray-500 font-medium">No templates found for "{searchQuery}"</p>
                       <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-400 text-sm hover:text-blue-300 font-bold">Clear search</button>
                   </div>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredTemplates.map(template => (
                            <div key={template.id} onClick={() => onSelect(template)} className="group bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 flex flex-col h-[300px] relative">
                                
                                {/* Thumbnail Container */}
                                <div className="h-44 bg-[#111] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                                    
                                    <div className="transform scale-75 transition-transform duration-700 group-hover:scale-90 relative z-10 drop-shadow-2xl">
                                         <MiniPreview elements={template.elements} settings={template.canvasSettings} />
                                    </div>
                                    
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className="bg-black/60 backdrop-blur-md text-gray-300 text-[9px] font-bold px-2 py-1 rounded-md border border-white/10 uppercase tracking-wide">
                                            {template.category}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Info */}
                                <div className="p-5 flex-1 flex flex-col bg-[#0a0a0a]">
                                    <div className="mb-2">
                                        <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{template.name}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{template.description}</p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-600 font-mono flex items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                                            {template.canvasSettings.width}x{template.canvasSettings.height}
                                        </span>
                                        <span className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center">
                                            Use Template <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                   </div>
               )}
          </div>
      </main>
    </div>
  );
};

export default TemplateSelector;