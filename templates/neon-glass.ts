import { Template } from '../types';

const template: Template = {
  "id": "neon-glass",
  "name": "Cyberpunk Glass",
  "description": "Futuristic dark glassmorphism card with neon accents.",
  "category": "Dark UI",
  "thumbnail": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  "canvasSettings": { 
    "width": 340, 
    "height": 160, 
    "backgroundColor": "#020617",
    "borderRadius": 20,
    "borderColor": "#1e293b",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "bg-glow",
      "type": "box",
      "name": "GlowEffect",
      "style": { "position": "absolute", "left": 180, "top": -30, "width": 160, "height": 160, "backgroundColor": "#3b82f6", "borderRadius": 100, "opacity": 0.15, "filter": "blur(50px)", "zIndex": 0 }
    },
    {
      "id": "glass-panel",
      "type": "box",
      "name": "GlassLayer",
      "style": { "position": "absolute", "left": 0, "top": 0, "width": 340, "height": 160, "backgroundColor": "rgba(15, 23, 42, 0.4)", "borderRadius": 20, "zIndex": 1 },
      "glass": { "enabled": true, "blur": 12, "opacity": 30 }
    },
    {
      "id": "ng-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 48, "height": 48, "backgroundColor": "rgba(59, 130, 246, 0.1)", "borderRadius": 14, "border": "1px solid rgba(59, 130, 246, 0.2)", "zIndex": 2 }
    },
    {
      "id": "ng-icon",
      "type": "icon",
      "name": "Icon",
      "content": "bolt",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 48, "height": 48, "fontSize": 24, "color": "#60a5fa", "display": "flex", "alignItems": "center", "justifyContent": "center", "zIndex": 3 },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0.2, "easing": "elastic", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 3, "delay": 0, "easing": "ease-in-out", "intensity": 30, "infinite": true }
      }
    },
    {
      "id": "ng-label",
      "type": "text",
      "name": "Label",
      "content": "ACTIVE SESSIONS",
      "style": { "position": "absolute", "left": 85, "top": 24, "fontSize": 11, "color": "#94a3b8", "fontFamily": "Inter, sans-serif", "fontWeight": "600", "letterSpacing": "1px", "zIndex": 2 }
    },
    {
      "id": "ng-value",
      "type": "text",
      "name": "Value",
      "content": "2,845",
      "style": { "position": "absolute", "left": 82, "top": 42, "fontSize": 32, "fontWeight": "bold", "color": "#ffffff", "fontFamily": "Inter, sans-serif", "textShadow": "0 0 20px rgba(59, 130, 246, 0.5)", "zIndex": 2 },
      "animation": {
          "entry": { "type": "slide-up", "duration": 0.6, "delay": 0.1, "easing": "ease-out", "intensity": 30 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "ng-chart",
      "type": "sparkline",
      "name": "Trend",
      "style": { "position": "absolute", "left": 20, "top": 95, "width": 300, "height": 45, "filter": "drop-shadow(0 0 8px rgba(59,130,246,0.3))", "zIndex": 2 },
      "chartProps": { "color": "#60a5fa", "strokeWidth": 2, "dataPoints": [15, 25, 20, 35, 30, 45, 40, 60, 55, 75] },
      "animation": {
          "entry": { "type": "fade", "duration": 1, "delay": 0.5, "easing": "ease", "intensity": 100 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    }
  ]
};

export default template;