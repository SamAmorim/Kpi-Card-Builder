import { CanvasElement, CanvasSettings } from '../../types';

export interface ScriptAction {
    type: 'move' | 'wait' | 'click' | 'type-text' | 'set-stage' | 'set-prop' | 'play-sound' | 'flash';
    x?: number; // 0-100 percentage of screen width
    y?: number; // 0-100 percentage of screen height
    duration?: number; // ms
    delay?: number; // ms
    stage?: DemoStage;
    text?: string;
    propKey?: string;
    propValue?: any;
    targetId?: string; // ID for highlighting fake UI elements
    soundName?: string;
}

export type DemoStage = 'landing' | 'templates' | 'editor' | 'void' | 'outro';

export interface DemoState {
    cursor: { x: number; y: number; isDown: boolean };
    stage: DemoStage;
    activeTargetId: string | null; // Which UI element is currently hovered/active
    accentColor: string;
    isExploded: boolean;
    bootProgress: number;
}