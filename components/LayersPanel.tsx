import React from 'react';
import { CanvasElement, Translation } from '../types';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onDelete: (id: string) => void;
  t: Translation;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ elements, selectedId, onSelect, onReorder, onDelete, t }) => {
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
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
              <span className="material-symbols-outlined text-3xl mb-2">layers_clear</span>
              <span className="text-xs">{t.noLayers}</span>
          </div>
      );
  }

  return (
    <div className="flex flex-col space-y-1 p-2">
      {reversedElements.map((el) => (
        <div
          key={el.id}
          draggable
          onDragStart={(e) => handleDragStart(e, el.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, el.id)}
          onClick={() => onSelect(el.id)}
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-all ${
            selectedId === el.id 
              ? 'bg-blue-900/20 border-blue-500/30 shadow-sm' 
              : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/5'
          } ${draggedItem === el.id ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="material-symbols-outlined text-gray-600 text-sm cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors">drag_indicator</span>
            <span className={`material-symbols-outlined text-sm ${selectedId === el.id ? 'text-blue-400' : 'text-gray-500'}`}>
                {getIcon(el.type)}
            </span>
            <span className={`text-xs truncate max-w-[120px] font-medium ${selectedId === el.id ? 'text-white' : 'text-gray-400'}`}>
                {el.name}
            </span>
          </div>
          
          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
             className="text-gray-600 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
          >
             <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default LayersPanel;