import { Template } from '../types';

const template: Template = {
  "id": "profile-card",
  "name": "Team Member",
  "description": "Card with image, status badge, action button and metrics.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  "canvasSettings": { 
    "width": 320, 
    "height": 150, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#cbd5e1",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "p1-img",
      "type": "image",
      "name": "Avatar",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 56, "height": 56, "borderRadius": 28, "border": "2px solid #ffffff", "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
      "chartProps": { "imageUrl": "https://i.pravatar.cc/150?img=68" },
      "animation": {
          "entry": { "type": "fade", "duration": 0.5, "delay": 0, "easing": "ease", "intensity": 0 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "p1-name",
      "type": "text",
      "name": "Name",
      "content": "Sarah Johnson",
      "style": { "position": "absolute", "left": 90, "top": 22, "fontSize": 16, "fontWeight": "bold", "color": "#1e293b", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "p1-role",
      "type": "text",
      "name": "Role",
      "content": "Sales Manager",
      "style": { "position": "absolute", "left": 90, "top": 44, "fontSize": 12, "color": "#64748b", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "p1-badge-bg",
      "type": "box",
      "name": "BadgeBg",
      "style": { "position": "absolute", "left": 240, "top": 22, "width": 60, "height": 22, "backgroundColor": "#dcfce7", "borderRadius": 6 }
    },
    {
      "id": "p1-badge-txt",
      "type": "text",
      "name": "BadgeTxt",
      "content": "Online",
      "style": { "position": "absolute", "left": 240, "top": 24, "width": 60, "fontSize": 10, "fontWeight": "bold", "color": "#166534", "fontFamily": "Inter, sans-serif", "textAlign": "center" }
    },
    {
      "id": "p1-btn",
      "type": "text",
      "name": "ActionBtn",
      "content": "Message",
      "style": { "position": "absolute", "left": 230, "top": 50, "width": 70, "height": 26, "backgroundColor": "#f1f5f9", "color": "#475569", "fontSize": 10, "fontWeight": "600", "borderRadius": 6, "display": "flex", "alignItems": "center", "justifyContent": "center", "cursor": "pointer" }
    },
    {
        "id": "p1-div",
        "type": "box",
        "name": "Divider",
        "style": { "position": "absolute", "left": 20, "top": 90, "width": 280, "height": 1, "backgroundColor": "#f1f5f9" }
    },
    {
      "id": "p1-spark",
      "type": "sparkline",
      "name": "Performance",
      "style": { "position": "absolute", "left": 20, "top": 105, "width": 280, "height": 30 },
      "chartProps": { "color": "#3b82f6", "strokeWidth": 2, "dataPoints": [10, 15, 13, 20, 18, 25, 22, 30, 28, 35] }
    }
  ]
};

export default template;