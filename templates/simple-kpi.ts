import { Template } from '../types';

const template: Template = {
  "id": "simple-kpi",
  "name": "Executive KPI",
  "description": "Clean big number card with trend context and icon.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  "canvasSettings": { 
    "width": 300, 
    "height": 140, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e2e8f0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Icon Background
    {
      "id": "t1-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 40, "height": 40, "backgroundColor": "#eff6ff", "borderRadius": 12 },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0, "easing": "elastic", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "t1-icon",
      "type": "icon",
      "name": "Icon",
      "content": "attach_money",
      "style": { "position": "absolute", "left": 24, "top": 24, "fontSize": 24, "width": 32, "height": 32, "color": "#2563eb", "display": "flex", "alignItems": "center", "justifyContent": "center" }
    },
    {
      "id": "t1-label",
      "type": "text",
      "name": "Label",
      "content": "Total Revenue",
      "style": { "position": "absolute", "left": 75, "top": 22, "fontSize": 12, "fontWeight": "600", "color": "#64748b", "fontFamily": "Inter, sans-serif", "textTransform": "uppercase", "letterSpacing": "0.5px" }
    },
    {
      "id": "t1-period",
      "type": "text",
      "name": "Period",
      "content": "Last 30 Days",
      "style": { "position": "absolute", "left": 75, "top": 40, "fontSize": 11, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "t1-value",
      "type": "text",
      "name": "Value",
      "content": "$1.2M",
      "dataBinding": "[Total Revenue]",
      "style": { "position": "absolute", "left": 20, "top": 75, "fontSize": 36, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif", "letterSpacing": "-1px" },
      "animation": {
          "entry": { "type": "slide-up", "duration": 0.6, "delay": 0.1, "easing": "ease-out", "intensity": 20 },
          "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 2 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    // Trend Badge
    {
      "id": "t1-badge-bg",
      "type": "box",
      "name": "BadgeBg",
      "style": { "position": "absolute", "left": 140, "top": 82, "width": 60, "height": 24, "backgroundColor": "#dcfce7", "borderRadius": 20 }
    },
    {
      "id": "t1-badge-txt",
      "type": "text",
      "name": "BadgeTxt",
      "content": "+12.5%",
      "style": { "position": "absolute", "left": 140, "top": 84, "width": 60, "fontSize": 11, "fontWeight": "bold", "color": "#16a34a", "fontFamily": "Inter, sans-serif", "textAlign": "center" }
    }
  ]
};

export default template;