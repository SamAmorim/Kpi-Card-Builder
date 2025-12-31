import { Template } from '../types';

const template: Template = {
  "id": "goal-tracker",
  "name": "Quarterly Goals",
  "description": "Progress tracking with circular indicator and monthly breakdown.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
  "canvasSettings": { 
    "width": 340, 
    "height": 170, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#fed7aa",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "gt-header",
      "type": "text",
      "name": "Header",
      "content": "Q3 Revenue Target",
      "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 14, "fontWeight": "600", "color": "#9a3412", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "gt-circle-bg",
      "type": "circular-progress",
      "name": "ProgressBg",
      "style": { "position": "absolute", "left": 20, "top": 50, "width": 80, "height": 80 },
      "chartProps": { "value": 100, "color": "#ffedd5", "strokeWidth": 8, "backgroundColor": "transparent" }
    },
    {
      "id": "gt-circle",
      "type": "circular-progress",
      "name": "Progress",
      "style": { "position": "absolute", "left": 20, "top": 50, "width": 80, "height": 80 },
      "chartProps": { "value": 78, "color": "#f97316", "strokeWidth": 8, "backgroundColor": "transparent" },
      "animation": {
          "entry": { "type": "spin", "duration": 1.5, "delay": 0.2, "easing": "ease-out", "intensity": 30 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "gt-percent",
      "type": "text",
      "name": "Percent",
      "content": "78%",
      "style": { "position": "absolute", "left": 38, "top": 78, "fontSize": 18, "fontWeight": "bold", "color": "#c2410c", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "gt-chart",
      "type": "bar-chart",
      "name": "MonthlyTrend",
      "style": { "position": "absolute", "left": 130, "top": 55, "width": 180, "height": 75 },
      "chartProps": { 
          "dataPoints": [45, 60, 75, 50, 80], 
          "categories": ["M1", "M2", "M3", "M4", "M5"],
          "color": "#fb923c",
          "backgroundColor": "transparent"
      },
      "animation": {
          "entry": { "type": "slide-left", "duration": 0.8, "delay": 0.4, "easing": "ease-out", "intensity": 20 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "gt-current",
      "type": "text",
      "name": "CurrentVal",
      "content": "$78,450 / $100k",
      "style": { "position": "absolute", "left": 20, "top": 140, "fontSize": 12, "fontWeight": "500", "color": "#9ca3af", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;