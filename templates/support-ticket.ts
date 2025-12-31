import { Template } from '../types';

const template: Template = {
  "id": "support-ticket",
  "name": "Support Queue",
  "description": "Urgency-focused card for support teams showing open tickets.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #fff1f2 0%, #fff 100%)",
  "canvasSettings": { 
    "width": 280, 
    "height": 140, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#fecaca",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "st-icon",
      "type": "icon",
      "name": "AlertIcon",
      "content": "notifications",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 24, "height": 24, "fontSize": 24, "color": "#ef4444" },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0, "easing": "elastic", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "shake", "duration": 3, "delay": 2, "easing": "ease-in-out", "intensity": 20, "infinite": true }
      }
    },
    {
      "id": "st-label",
      "type": "text",
      "name": "Label",
      "content": "OPEN TICKETS",
      "style": { "position": "absolute", "left": 55, "top": 24, "fontSize": 11, "fontWeight": "bold", "color": "#7f1d1d", "fontFamily": "Inter, sans-serif", "letterSpacing": "0.5px" }
    },
    {
      "id": "st-val",
      "type": "text",
      "name": "Value",
      "content": "24",
      "style": { "position": "absolute", "left": 20, "top": 55, "fontSize": 48, "fontWeight": "bold", "color": "#dc2626", "fontFamily": "Inter, sans-serif", "letterSpacing": "-2px" }
    },
    {
      "id": "st-trend-badge",
      "type": "box",
      "name": "BadgeBg",
      "style": { "position": "absolute", "left": 100, "top": 70, "width": 60, "height": 24, "backgroundColor": "#fef2f2", "borderRadius": 12, "border": "1px solid #fee2e2" }
    },
    {
      "id": "st-trend-txt",
      "type": "text",
      "name": "BadgeTxt",
      "content": "+8 Today",
      "style": { "position": "absolute", "left": 100, "top": 74, "width": 60, "textAlign": "center", "fontSize": 10, "fontWeight": "bold", "color": "#b91c1c", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "st-chart",
      "type": "bar-chart",
      "name": "VolumeChart",
      "style": { "position": "absolute", "left": 180, "top": 55, "width": 80, "height": 60 },
      "chartProps": { 
          "dataPoints": [5, 12, 8, 15, 24], 
          "color": "#ef4444", 
          "backgroundColor": "transparent" 
      }
    },
    {
      "id": "st-footer",
      "type": "text",
      "name": "Footer",
      "content": "Avg Response: 12m",
      "style": { "position": "absolute", "left": 20, "top": 110, "fontSize": 11, "color": "#9ca3af", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;