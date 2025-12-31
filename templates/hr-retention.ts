import { Template } from '../types';

const template: Template = {
  "id": "hr-retention",
  "name": "HR Retention",
  "description": "Employee stability tracking with hiring and turnover metrics.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
  "canvasSettings": { 
    "width": 340, 
    "height": 160, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#bbf7d0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header
    {
      "id": "hr-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 32, "height": 32, "backgroundColor": "#f0fdf4", "borderRadius": 8 }
    },
    {
      "id": "hr-icon",
      "type": "icon",
      "name": "Icon",
      "content": "group",
      "style": { "position": "absolute", "left": 24, "top": 24, "width": 24, "height": 24, "fontSize": 20, "color": "#16a34a" }
    },
    {
      "id": "hr-title",
      "type": "text",
      "name": "Title",
      "content": "Retention Rate",
      "style": { "position": "absolute", "left": 65, "top": 20, "fontSize": 12, "fontWeight": "600", "color": "#14532d", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "hr-period",
      "type": "text",
      "name": "Period",
      "content": "Year to Date",
      "style": { "position": "absolute", "left": 65, "top": 36, "fontSize": 10, "color": "#86efac", "fontFamily": "Inter, sans-serif", "fontWeight": "bold" }
    },

    // Main Chart
    {
        "id": "hr-donut-bg",
        "type": "circular-progress",
        "name": "DonutBg",
        "style": { "position": "absolute", "left": 20, "top": 65, "width": 70, "height": 70 },
        "chartProps": { "value": 100, "color": "#f0fdf4", "backgroundColor": "transparent", "strokeWidth": 6 }
    },
    {
        "id": "hr-donut",
        "type": "circular-progress",
        "name": "Donut",
        "style": { "position": "absolute", "left": 20, "top": 65, "width": 70, "height": 70 },
        "chartProps": { "value": 94, "color": "#22c55e", "backgroundColor": "transparent", "strokeWidth": 6 },
        "animation": {
            "entry": { "type": "spin", "duration": 1, "delay": 0.2, "easing": "ease-out", "intensity": 30 },
            "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "hr-val",
        "type": "text",
        "name": "Value",
        "content": "94%",
        "style": { "position": "absolute", "left": 35, "top": 88, "fontSize": 16, "fontWeight": "bold", "color": "#15803d", "fontFamily": "Inter, sans-serif" }
    },

    // Stats Column 1
    {
        "id": "hr-hired-lbl",
        "type": "text",
        "name": "HiredLbl",
        "content": "New Hires",
        "style": { "position": "absolute", "left": 110, "top": 70, "fontSize": 10, "color": "#64748b", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "hr-hired-val",
        "type": "text",
        "name": "HiredVal",
        "content": "+24",
        "style": { "position": "absolute", "left": 110, "top": 85, "fontSize": 14, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },

    // Stats Column 2
    {
        "id": "hr-turn-lbl",
        "type": "text",
        "name": "TurnoverLbl",
        "content": "Turnover",
        "style": { "position": "absolute", "left": 190, "top": 70, "fontSize": 10, "color": "#64748b", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "hr-turn-val",
        "type": "text",
        "name": "TurnoverVal",
        "content": "3.2%",
        "style": { "position": "absolute", "left": 190, "top": 85, "fontSize": 14, "fontWeight": "bold", "color": "#ef4444", "fontFamily": "Inter, sans-serif" }
    },

    // Footer Bar
    {
        "id": "hr-bar-bg",
        "type": "box",
        "name": "BarBg",
        "style": { "position": "absolute", "left": 110, "top": 120, "width": 200, "height": 6, "backgroundColor": "#f1f5f9", "borderRadius": 3 }
    },
    {
        "id": "hr-bar",
        "type": "progress-bar",
        "name": "TargetBar",
        "style": { "position": "absolute", "left": 110, "top": 120, "width": 180, "height": 6, "borderRadius": 3 },
        "chartProps": { "value": 90, "color": "#16a34a", "backgroundColor": "transparent" }
    },
    {
        "id": "hr-target",
        "type": "text",
        "name": "TargetLbl",
        "content": "Target: 95%",
        "style": { "position": "absolute", "left": 250, "top": 105, "fontSize": 9, "fontWeight": "600", "color": "#16a34a", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;