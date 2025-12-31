import React from 'react';

export type Language = 'en' | 'pt';

export type ElementType = 'text' | 'box' | 'icon' | 'progress-bar' | 'circular-progress' | 'sparkline' | 'image' | 'table' | 'bar-chart' | 'area-chart' | 'column-chart';

export type ConditionalOperator = '>' | '<' | '=' | '>=' | '<=';

export interface ConditionalRule {
  id: string;
  targetProperty: 'color' | 'backgroundColor';
  operator: ConditionalOperator;
  value: number;
  outputColor: string;
}

// --- Animation Types ---
export type AnimationType = 
    | 'none' 
    | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'spin' // Entry focused
    | 'rotate' // Hover focused
    | 'float' | 'breathing' | 'shimmer' | 'heartbeat' | 'shake' | 'wiggle' | 'pulse' | 'carousel-fade'; // Idle focused

export type AnimationEasing = 'linear' | 'ease' | 'ease-out' | 'ease-in-out' | 'elastic' | 'bounce-out';

export interface AnimationConfig {
    type: AnimationType;
    duration: number; // seconds
    delay: number; // seconds
    easing: AnimationEasing;
    intensity: number; // 0-100 (controls distance, scale amount, or opacity range)
    infinite?: boolean; // mostly for idle
}

export interface AnimationSettings {
  entry: AnimationConfig;
  hover: AnimationConfig;
  idle: AnimationConfig;
}

export interface GlassSettings {
    enabled: boolean;
    blur: number; // px
    opacity: number; // 0-100 (background opacity override)
}

export interface TableColumn {
  id: string;
  header: string;
  width: number; // percentage or pixels
  dataBinding?: string; // Measure for this column
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  style: React.CSSProperties;
  content?: string; // Text content, Icon name, or Value for charts (as string "50")
  dataBinding?: string; // Placeholder for Power BI measure name (Text/Simple inputs)
  
  // New features
  conditionalFormatting?: ConditionalRule[];
  animation?: AnimationSettings;
  glass?: GlassSettings;
  
  // Specific properties
  chartProps?: {
    value?: number; // 0-100 for progress
    strokeWidth?: number;
    color?: string; // Fill or Stroke color
    backgroundColor?: string; // Track color (or Fill color for Area charts)
    dataPoints?: number[]; // For sparklines and bar charts (Visual Preview)
    categories?: string[]; // For bar chart labels (Visual Preview)
    imageUrl?: string; // For images
    
    // Granular Visual Controls
    barGap?: number; // For bar/column charts (px)
    barRadius?: number; // For bar/column charts (px)
    lineSmoothing?: boolean; // For area/sparkline (curve vs linear)
    lineCap?: 'round' | 'butt'; // For progress/donut
    showAxis?: boolean; // Toggle axis labels
    axisColor?: string;
    
    // Power BI Bindings
    axisBinding?: string; // e.g. VALUES('Date'[Date])
    valueBinding?: string; // e.g. [Total Sales]
  };
  
  tableProps?: {
    columns: TableColumn[];
    rowHeight: number;
    headerColor: string;
    headerBgColor: string;
    rowColor: string;
    rowBgColor: string;
    gridColor: string;
  };
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  background?: string; // NEW: Supports gradients (e.g. 'linear-gradient(...)')
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  showShadow: boolean;
  isResponsive?: boolean; // NEW: If true, exports width/height as 100%
}

export interface ProjectState {
  elements: CanvasElement[];
  selectedIds: string[]; // UPDATED: Array support for multi-selection
  canvasSettings: CanvasSettings;
}

export type TemplateCategory = 'KPI' | 'Card' | 'Dark' | 'Chart' | 'Executive' | 'Analytics' | 'Dark UI' | 'Grid';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string; // CSS background or simple representation
  elements: CanvasElement[];
  canvasSettings: CanvasSettings;
}

export interface GeneratorOutput {
  html: string;
  dax: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface Translation {
  heroTitleStart: string;
  heroTitleEnd: string;
  heroSubtitle: string;
  ctaStart: string;
  
  // Features Strip
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  sectionHowTo: string;
  step1: string;
  step2: string;
  step3: string;
  editorTitle: string;
  export: string;
  properties: string;
  layers: string;
  addText: string;
  addBox: string;
  addIcon: string;
  noSelection: string;
  width: string;
  height: string;
  color: string;
  text: string;
  fontSize: string;
  borderRadius: string;
  opacity: string;
  dataMeasure: string;
  generatedCode: string;
  copy: string;
  close: string;
  fontFamily: string;
  templates: string;
  chooseTemplate: string;
  blankCanvas: string;
  startFromScratch: string;
  value: string;
  strokeWidth: string;
  trackColor: string;
  fillColor: string;
  charts: string;
  canvasSettings: string;
  showShadow: string;
  borderWidth: string;
  borderColor: string;
  sparklineData: string;
  imageUrl: string;
  conditionalLogic: string;
  addRule: string;
  animations: string;
  entryAnimation: string;
  hoverEffect: string;
  tableSetup: string;
  columns: string;
  addColumn: string;
  contributors: string;
  loading: string;
  undo: string;
  redo: string;
  copied: string;
  pasted: string;
  deleted: string;
  clearCanvasConfirm: string;
  confirm: string;
  cancel: string;
  emptyState: string;
  emptyStateDesc: string;
  bringForward: string;
  sendBackward: string;
  noLayers: string;
  // Prop Panel
  layout: string;
  appearance: string;
  typography: string;
  borderStyle: string;
  
  // Data Guides
  dataGuideTitle: string;
  dataGuide_text_desc: string;
  dataGuide_progress_desc: string;
  dataGuide_chart_desc: string;
  dataGuide_image_desc: string;
  selectIcon: string;
  
  // Glass
  glassEffect: string;
  blur: string;
  glassOpacity: string;

  // Shortcuts
  shortcuts: string;
  keyboardShortcuts: string;
  moveElement: string;
  moveFaster: string;
  deleteElement: string;
  panCanvas: string;
  zoomCanvas: string;
}