import React from 'react';
import { Translation } from '../types';

interface ShortcutsModalProps {
  onClose: () => void;
  t: Translation;
}

const ShortcutRow: React.FC<{ keys: string[], description: string }> = ({ keys, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-600 font-medium">{description}</span>
        <div className="flex space-x-1">
            {keys.map((k, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-mono text-gray-700 shadow-sm">
                    {k}
                </span>
            ))}
        </div>
    </div>
);

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose, t }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-blue-600">keyboard</span>
              <h3 className="text-lg font-bold text-gray-800">{t.keyboardShortcuts}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">
            <ShortcutRow keys={['Ctrl', 'Z']} description={t.undo} />
            <ShortcutRow keys={['Ctrl', 'Y']} description={t.redo} />
            <ShortcutRow keys={['Del', 'Backspace']} description={t.deleteElement} />
            <ShortcutRow keys={['Arrow Keys']} description={t.moveElement} />
            <ShortcutRow keys={['Shift', 'Arrow Keys']} description={t.moveFaster} />
            <ShortcutRow keys={['Space', 'Drag']} description={t.panCanvas} />
            <ShortcutRow keys={['Ctrl', 'Scroll']} description={t.zoomCanvas} />
        </div>
        <div className="p-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">Press keys while focusing on the canvas.</p>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;