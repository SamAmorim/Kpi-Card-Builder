import { Template } from '../types';

const template: Template = {
  "id": "saas-growth",
  "name": "SaaS Growth",
  "description": "Premium subscription analytics card with soft purple gradients.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)",
  "canvasSettings": { 
    "width": 320, 
    "height": 190, 
    "backgroundColor": "#fdfbfc",
    "borderRadius": 24,
    "borderColor": "#e0e7ff",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "sg-bg-gradient",
      "type": "box",
      "name": "GradientBg",
      "style": { "position": "absolute", "left": 0, "top": 0, "width": 320, "height": 190, "backgroundColor": "#f5f3ff", "borderRadius": 24, "zIndex": 0, "opacity": 0.5 }
    },
    {
      "id": "sg-bg-blob",
      "type": "box",
      "name": "Decoration",
      "style": { "position": "absolute", "left": 200, "top": -30, "width": 150, "height": 150, "backgroundColor": "#8b5cf6", "borderRadius": 100, "opacity": 0.08, "filter": "blur(40px)", "zIndex": 1 }
    },
    {
      "id": "sg-card-header",
      "type": "text",
      "name": "Header",
      "content": "RETENTION RATE",
      "style": { "position": "absolute", "left": 24, "top": 24, "fontSize": 12, "fontWeight": "bold", "color": "#7c3aed", "fontFamily": "Inter, sans-serif", "letterSpacing": "1px", "zIndex": 2 }
    },
    {
      "id": "sg-main-val",
      "type": "text",
      "name": "Value",
      "content": "94.2%",
      "style": { "position": "absolute", "left": 22, "top": 45, "fontSize": 42, "fontWeight": "bold", "color": "#1e1b4b", "fontFamily": "Inter, sans-serif", "letterSpacing": "-2px", "zIndex": 2 },
      "animation": {
          "entry": { "type": "slide-up", "duration": 0.6, "delay": 0.1, "easing": "ease-out", "intensity": 30 },
          "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "sg-donut-bg",
      "type": "circular-progress",
      "name": "DonutBG",
      "style": { "position": "absolute", "left": 220, "top": 35, "width": 70, "height": 70, "opacity": 0.2, "zIndex": 2 },
      "chartProps": { "value": 100, "color": "#ddd6fe", "backgroundColor": "transparent", "strokeWidth": 6 }
    },
    {
      "id": "sg-donut",
      "type": "circular-progress",
      "name": "Donut",
      "style": { "position": "absolute", "left": 220, "top": 35, "width": 70, "height": 70, "zIndex": 3 },
      "chartProps": { "value": 94, "color": "#8b5cf6", "backgroundColor": "transparent", "strokeWidth": 6 },
      "animation": {
          "entry": { "type": "spin", "duration": 1.2, "delay": 0.2, "easing": "ease-out", "intensity": 40 },
          "hover": { "type": "rotate", "duration": 0.5, "delay": 0, "easing": "ease", "intensity": 20 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "sg-donut-icon",
      "type": "icon",
      "name": "Icon",
      "content": "group",
      "style": { "position": "absolute", "left": 243, "top": 58, "width": 24, "height": 24, "fontSize": 24, "color": "#7c3aed", "zIndex": 2 }
    },
    {
      "id": "sg-divider",
      "type": "box",
      "name": "Divider",
      "style": { "position": "absolute", "left": 24, "top": 110, "width": 272, "height": 1, "backgroundColor": "#e0e7ff", "zIndex": 2 }
    },
    {
      "id": "sg-sub-1",
      "type": "text",
      "name": "SubTitle",
      "content": "Monthly Churn",
      "style": { "position": "absolute", "left": 24, "top": 125, "fontSize": 12, "color": "#64748b", "fontFamily": "Inter, sans-serif", "zIndex": 2 }
    },
    {
      "id": "sg-sub-val",
      "type": "text",
      "name": "SubValue",
      "content": "1.8%",
      "style": { "position": "absolute", "left": 24, "top": 145, "fontSize": 16, "fontWeight": "bold", "color": "#1e293b", "fontFamily": "Inter, sans-serif", "zIndex": 2 }
    },
    {
      "id": "sg-badge",
      "type": "box",
      "name": "BadgeBg",
      "style": { "position": "absolute", "left": 135, "top": 58, "width": 55, "height": 20, "backgroundColor": "#dcfce7", "borderRadius": 4, "zIndex": 2 }
    },
    {
      "id": "sg-badge-txt",
      "type": "text",
      "name": "BadgeTxt",
      "content": "+2.4%",
      "style": { "position": "absolute", "left": 135, "top": 58, "width": 55, "height": 20, "fontSize": 10, "fontWeight": "bold", "color": "#15803d", "fontFamily": "Inter, sans-serif", "display": "flex", "alignItems": "center", "justifyContent": "center", "zIndex": 3 }
    },
    {
        "id": "sg-btn",
        "type": "text",
        "name": "Button",
        "content": "View Report",
        "style": { "position": "absolute", "left": 210, "top": 135, "width": 85, "height": 30, "backgroundColor": "#f3e8ff", "color": "#6d28d9", "fontSize": 11, "fontWeight": "bold", "borderRadius": 8, "display": "flex", "alignItems": "center", "justifyContent": "center", "cursor": "pointer", "zIndex": 2, "border": "1px solid #d8b4fe" },
        "animation": {
            "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
            "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 5 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    }
  ]
};

export default template;