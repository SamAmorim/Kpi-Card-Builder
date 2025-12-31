import { Template } from '../types';

const template: Template = {
  "id": "cmo-insight",
  "name": "Marketing ROI",
  "description": "Campaign performance tracking with conversion funnel visuals.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
  "canvasSettings": { 
    "width": 340, 
    "height": 160, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#fecdd3",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header Section
    {
      "id": "cmo-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 32, "height": 32, "backgroundColor": "#fff1f2", "borderRadius": 8, "border": "1px solid #fecdd3" }
    },
    {
      "id": "cmo-icon",
      "type": "icon",
      "name": "Icon",
      "content": "trending_up",
      "style": { "position": "absolute", "left": 24, "top": 24, "width": 24, "height": 24, "fontSize": 20, "color": "#e11d48" }
    },
    {
      "id": "cmo-title",
      "type": "text",
      "name": "Title",
      "content": "Campaign ROAS",
      "style": { "position": "absolute", "left": 65, "top": 20, "fontSize": 12, "fontWeight": "600", "color": "#881337", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "cmo-subtitle",
      "type": "text",
      "name": "Subtitle",
      "content": "Q3 Performance",
      "style": { "position": "absolute", "left": 65, "top": 36, "fontSize": 10, "color": "#9f1239", "fontFamily": "Inter, sans-serif" }
    },

    // Main Metric
    {
      "id": "cmo-val",
      "type": "text",
      "name": "Value",
      "content": "4.8x",
      "style": { "position": "absolute", "left": 20, "top": 70, "fontSize": 36, "fontWeight": "bold", "color": "#e11d48", "fontFamily": "Inter, sans-serif", "letterSpacing": "-1px" },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0.2, "easing": "bounce-out", "intensity": 30 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "cmo-target",
      "type": "text",
      "name": "Target",
      "content": "vs 3.5x Target",
      "style": { "position": "absolute", "left": 20, "top": 115, "fontSize": 11, "fontWeight": "500", "color": "#10b981", "fontFamily": "Inter, sans-serif" }
    },

    // Right Side: Cost Breakdown
    {
        "id": "cmo-chart-bg",
        "type": "box",
        "name": "ChartBg",
        "style": { "position": "absolute", "left": 160, "top": 20, "width": 160, "height": 120, "backgroundColor": "#fff1f2", "borderRadius": 8, "opacity": 0.5 }
    },
    {
        "id": "cmo-chart-lbl",
        "type": "text",
        "name": "ConvLabel",
        "content": "Conversion Trend",
        "style": { "position": "absolute", "left": 170, "top": 30, "fontSize": 10, "fontWeight": "bold", "color": "#9f1239", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "cmo-area",
        "type": "area-chart",
        "name": "TrendChart",
        "style": { "position": "absolute", "left": 170, "top": 50, "width": 140, "height": 50 },
        "chartProps": { 
            "dataPoints": [20, 35, 30, 50, 45, 60, 55, 80], 
            "color": "#e11d48", 
            "backgroundColor": "#fecdd3", 
            "strokeWidth": 2 
        }
    },
    {
        "id": "cmo-cpl",
        "type": "text",
        "name": "CPL",
        "content": "CPL: $24.50",
        "style": { "position": "absolute", "left": 170, "top": 115, "fontSize": 10, "fontWeight": "bold", "color": "#881337", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 140 }
    }
  ]
};

export default template;