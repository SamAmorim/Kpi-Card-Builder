import { Template } from '../types';

const template: Template = {
  "id": "social-engagement",
  "name": "Social Engagement",
  "description": "Social media performance with trend graph and interaction breakdown.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #eef2ff 0%, #c7d2fe 100%)",
  "canvasSettings": { 
    "width": 340, 
    "height": 200, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e0e7ff",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header
    {
      "id": "se-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 36, "height": 36, "backgroundColor": "#eff6ff", "borderRadius": 10 }
    },
    {
      "id": "se-icon",
      "type": "icon",
      "name": "Icon",
      "content": "thumb_up",
      "style": { "position": "absolute", "left": 26, "top": 26, "width": 24, "height": 24, "fontSize": 20, "color": "#3b82f6" }
    },
    {
      "id": "se-title",
      "type": "text",
      "name": "Title",
      "content": "Total Engagement",
      "style": { "position": "absolute", "left": 68, "top": 20, "fontSize": 12, "color": "#64748b", "fontFamily": "Inter, sans-serif", "fontWeight": "600" }
    },
    {
      "id": "se-period",
      "type": "text",
      "name": "Period",
      "content": "Last 30 Days",
      "style": { "position": "absolute", "left": 68, "top": 36, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    
    // Main Metric
    {
      "id": "se-val",
      "type": "text",
      "name": "Value",
      "content": "128.4k",
      "style": { "position": "absolute", "left": 20, "top": 70, "fontSize": 32, "fontWeight": "bold", "color": "#1e3a8a", "fontFamily": "Inter, sans-serif", "letterSpacing": "-1px" },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0.2, "easing": "bounce-out", "intensity": 30 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    
    // Main Chart
    {
      "id": "se-chart",
      "type": "area-chart",
      "name": "Trend",
      "style": { "position": "absolute", "left": 140, "top": 65, "width": 180, "height": 50 },
      "chartProps": { 
          "dataPoints": [20, 45, 30, 60, 55, 80, 70, 95], 
          "color": "#3b82f6", 
          "backgroundColor": "#dbeafe", 
          "strokeWidth": 2 
      },
      "animation": {
          "entry": { "type": "slide-left", "duration": 0.8, "delay": 0.3, "easing": "ease-out", "intensity": 20 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 2 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },

    // Divider
    {
        "id": "se-div",
        "type": "box",
        "name": "Divider",
        "style": { "position": "absolute", "left": 20, "top": 130, "width": 300, "height": 1, "backgroundColor": "#f1f5f9" }
    },

    // Footer Stats (3 Cols)
    // Col 1
    {
        "id": "se-l-val",
        "type": "text",
        "name": "LikesVal",
        "content": "85k",
        "style": { "position": "absolute", "left": 20, "top": 145, "fontSize": 14, "fontWeight": "bold", "color": "#334155", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "se-l-lbl",
        "type": "text",
        "name": "LikesLbl",
        "content": "Likes",
        "style": { "position": "absolute", "left": 20, "top": 165, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    // Col 2
    {
        "id": "se-c-val",
        "type": "text",
        "name": "CommVal",
        "content": "24k",
        "style": { "position": "absolute", "left": 130, "top": 145, "fontSize": 14, "fontWeight": "bold", "color": "#334155", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "se-c-lbl",
        "type": "text",
        "name": "CommLbl",
        "content": "Comments",
        "style": { "position": "absolute", "left": 130, "top": 165, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    // Col 3
    {
        "id": "se-s-val",
        "type": "text",
        "name": "ShareVal",
        "content": "19.4k",
        "style": { "position": "absolute", "left": 240, "top": 145, "fontSize": 14, "fontWeight": "bold", "color": "#334155", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "se-s-lbl",
        "type": "text",
        "name": "ShareLbl",
        "content": "Shares",
        "style": { "position": "absolute", "left": 240, "top": 165, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;