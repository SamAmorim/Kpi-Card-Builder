import React from 'react';
import { CanvasElement, Translation } from '../types';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedIds: string[]; 
  onSelect: (ids: string[]) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onDelete: (id: string) => void;
  t: Translation;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ elements, selectedIds, onSelect, onReorder, onDelete, t }) => {
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);

  // We display layers in reverse order (top element first) to match visual stacking
  const reversedElements = [...elements].reverse();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetId) {
      onReorder(draggedItem, targetId);
    }
    setDraggedItem(null);
  };

  const handleLayerClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      let newSelection = [...selectedIds];
      
      // Multi-select Logic (Shift/Ctrl/Meta)
      if (e.ctrlKey || e.metaKey) {
          if (newSelection.includes(id)) {
              newSelection = newSelection.filter(sid => sid !== id);
          } else {
              newSelection.push(id);
          }
      } else if (e.shiftKey) {
          // Simple range select could be implemented here, but for now just add
          if (!newSelection.includes(id)) newSelection.push(id);
      } else {
          // Exclusive Select
          newSelection = [id];
      }
      
      onSelect(newSelection);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'text': return 'title';
          case 'box': return 'check_box_outline_blank';
          case 'image': return 'image';
          case 'icon': return 'star';
          case 'table': return 'table_chart';
          case 'progress-bar': return 'linear_scale';
          case 'circular-progress': return 'data_usage';
          case 'sparkline': return 'show_chart';
          case 'area-chart': return 'area_chart';
          case 'bar-chart': return 'bar_chart';
          case 'column-chart': return 'equalizer';
          default: return 'layers';
      }
  };

  if (elements.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <span className="material-symbols-outlined text-3xl mb-2 text-slate-300">layers_clear</span>
              <span className="text-xs text-slate-400">{t.noLayers}</span>
          </div>
      );
  }

  return (
    <div className="flex flex-col space-y-1 p-2">
      {reversedElements.map((el) => {
        const isSelected = selectedIds.includes(el.id);
        
        return (
            <div
            key={el.id}
            draggable
            onDragStart={(e) => handleDragStart(e, el.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, el.id)}
            onClick={(e) => handleLayerClick(e, el.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer border transition-all group ${
                isSelected 
                ? 'bg-blue-50 border-blue-200 shadow-sm z-10' 
                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
            } ${draggedItem === el.id ? 'opacity-50 dashed border-slate-300' : ''}`}
            >
            <div className="flex items-center space-x-3 overflow-hidden">
                <span className={`material-symbols-outlined text-sm cursor-grab active:cursor-grabbing transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-300 group-hover:text-slate-400'}`}>drag_indicator</span>
                <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {getIcon(el.type)}
                </span>
                <span className={`text-xs truncate max-w-[140px] font-medium ${isSelected ? 'text-blue-800' : 'text-slate-600'}`}>
                    {el.name}
                </span>
            </div>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
                className={`p-1 rounded transition-colors opacity-0 group-hover:opacity-100 ${isSelected ? 'text-blue-400 hover:text-red-500 hover:bg-blue-100' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'}`}
                title="Delete Layer"
            >
                <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            </div>
        );
      })}
    </div>
  );
};

export default LayersPanel;