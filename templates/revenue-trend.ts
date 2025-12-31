import { Template } from '../types';

const template: Template = {
  "id": "revenue-trend",
  "name": "Fintech Trend",
  "description": "Clean financial card with full-bleed area chart.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
  "canvasSettings": { 
    "width": 360, 
    "height": 180, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e2e8f0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "rt-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 40, "height": 40, "backgroundColor": "#f0fdf4", "borderRadius": 12 }
    },
    {
      "id": "rt-icon",
      "type": "icon",
      "name": "Icon",
      "content": "attach_money",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 40, "height": 40, "fontSize": 24, "color": "#16a34a", "display": "flex", "alignItems": "center", "justifyContent": "center" }
    },
    {
      "id": "rt-label",
      "type": "text",
      "name": "Label",
      "content": "TOTAL REVENUE",
      "style": { "position": "absolute", "left": 75, "top": 22, "fontSize": 11, "color": "#64748b", "fontFamily": "Inter, sans-serif", "fontWeight": "600", "letterSpacing": "0.5px" }
    },
    {
      "id": "rt-val",
      "type": "text",
      "name": "Value",
      "content": "$124,500",
      "style": { "position": "absolute", "left": 72, "top": 36, "fontSize": 24, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif", "letterSpacing": "-0.5px" }
    },
    {
      "id": "rt-badge-bg",
      "type": "box",
      "name": "BadgeBg",
      "style": { "position": "absolute", "left": 285, "top": 20, "width": 55, "height": 24, "backgroundColor": "#ecfdf5", "borderRadius": 20, "border": "1px solid #d1fae5" }
    },
    {
      "id": "rt-badge-txt",
      "type": "text",
      "name": "BadgeTxt",
      "content": "+12%",
      "style": { "position": "absolute", "left": 285, "top": 20, "width": 55, "height": 24, "fontSize": 12, "fontWeight": "bold", "color": "#059669", "fontFamily": "Inter, sans-serif", "display": "flex", "alignItems": "center", "justifyContent": "center" },
      "animation": {
          "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 2, "delay": 0, "easing": "ease-in-out", "intensity": 50, "infinite": true }
      }
    },
    {
        "id": "rt-chart",
        "type": "area-chart",
        "name": "Chart",
        "style": { "position": "absolute", "left": 0, "top": 80, "width": 360, "height": 100 },
        "chartProps": { 
            "color": "#10b981", 
            "backgroundColor": "#d1fae5", 
            "strokeWidth": 2, 
            "dataPoints": [20, 40, 35, 50, 45, 70, 60, 90, 85, 100] 
        },
        "animation": {
            "entry": { "type": "slide-up", "duration": 0.8, "delay": 0.2, "easing": "ease-out", "intensity": 20 },
            "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "rt-overlay",
        "type": "box",
        "name": "FadeOverlay",
        "style": { "position": "absolute", "left": 0, "top": 150, "width": 360, "height": 30, "background": "linear-gradient(to bottom, rgba(255,255,255,0), #ffffff)" }
    }
  ]
};

export default template;