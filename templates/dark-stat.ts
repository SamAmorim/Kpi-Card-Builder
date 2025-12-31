import { Template } from '../types';

const template: Template = {
  "id": "dark-stat",
  "name": "Midnight Analytics",
  "description": "Deep dark themed statistic card with vibrant accents.",
  "category": "Dark UI",
  "thumbnail": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  "canvasSettings": { 
    "width": 300, 
    "height": 130, 
    "backgroundColor": "#0f172a",
    "borderRadius": 12,
    "borderColor": "#1e293b",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
        "id": "ds-glow",
        "type": "box",
        "name": "TopGlow",
        "style": { "position": "absolute", "left": 0, "top": 0, "width": 300, "height": 2, "background": "linear-gradient(90deg, #3b82f6, #8b5cf6)" }
    },
    {
      "id": "t3-lbl",
      "type": "text",
      "name": "Label",
      "content": "GOAL ACHIEVEMENT",
      "style": { "position": "absolute", "left": 20, "top": 25, "fontSize": 10, "fontWeight": "bold", "color": "#94a3b8", "fontFamily": "Inter, sans-serif", "letterSpacing": "1.5px" }
    },
    {
      "id": "t3-val",
      "type": "text",
      "name": "Value",
      "content": "84.5%",
      "style": { "position": "absolute", "left": 20, "top": 45, "fontSize": 36, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "Inter, sans-serif", "letterSpacing": "-1px" },
      "animation": {
          "entry": { "type": "slide-left", "duration": 0.5, "delay": 0.1, "easing": "ease-out", "intensity": 20 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "t3-bar-bg",
      "type": "box",
      "name": "ProgressBg",
      "style": { "position": "absolute", "left": 20, "top": 95, "width": 260, "height": 6, "backgroundColor": "#1e293b", "borderRadius": 3 }
    },
    {
      "id": "t3-bar-fill",
      "type": "progress-bar",
      "name": "Progress",
      "style": { "position": "absolute", "left": 20, "top": 95, "width": 260, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 84.5, "color": "#60a5fa", "backgroundColor": "transparent" },
      "animation": {
          "entry": { "type": "slide-right", "duration": 1, "delay": 0.3, "easing": "ease-out", "intensity": 100 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
        "id": "t3-icon",
        "type": "icon",
        "name": "Icon",
        "content": "trending_up",
        "style": { "position": "absolute", "left": 250, "top": 25, "width": 24, "height": 24, "color": "#3b82f6" }
    }
  ]
};

export default template;