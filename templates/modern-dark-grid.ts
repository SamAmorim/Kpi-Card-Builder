import { Template } from '../types';

const template: Template = {
  "id": "modern-dark-grid",
  "name": "Command Center",
  "description": "High-density dark grid for monitoring multiple KPI signals.",
  "category": "Dark UI",
  "thumbnail": "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
  "canvasSettings": { 
    "width": 320, 
    "height": 200, 
    "backgroundColor": "#020617",
    "borderRadius": 12,
    "borderColor": "#1e293b",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header
    {
        "id": "md-header",
        "type": "text",
        "name": "Header",
        "content": "SYSTEM STATUS",
        "style": { "position": "absolute", "left": 20, "top": 15, "fontSize": 10, "fontWeight": "bold", "color": "#64748b", "fontFamily": "JetBrains Mono, monospace", "letterSpacing": "2px" }
    },
    {
        "id": "md-live",
        "type": "box",
        "name": "LiveDot",
        "style": { "position": "absolute", "left": 290, "top": 18, "width": 6, "height": 6, "backgroundColor": "#ef4444", "borderRadius": 4 },
        "animation": {
            "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
            "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
            "idle": { "type": "pulse", "duration": 1, "delay": 0, "easing": "linear", "intensity": 80, "infinite": true }
        }
    },

    // Horizontal Divide
    {
        "id": "md-div-h",
        "type": "box",
        "name": "DividerH",
        "style": { "position": "absolute", "left": 15, "top": 115, "width": 290, "height": 1, "backgroundColor": "#1e293b" }
    },
    // Vertical Divide
    {
        "id": "md-div-v",
        "type": "box",
        "name": "DividerV",
        "style": { "position": "absolute", "left": 160, "top": 40, "width": 1, "height": 145, "backgroundColor": "#1e293b" }
    },

    // Q1: Traffic
    {
        "id": "md-q1-icon",
        "type": "icon",
        "name": "Icon1",
        "content": "public",
        "style": { "position": "absolute", "left": 20, "top": 50, "width": 16, "height": 16, "fontSize": 16, "color": "#3b82f6" }
    },
    {
        "id": "md-q1-val",
        "type": "text",
        "name": "Val1",
        "content": "8.4k",
        "style": { "position": "absolute", "left": 20, "top": 70, "fontSize": 20, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "md-q1-lbl",
        "type": "text",
        "name": "Lbl1",
        "content": "Requests/s",
        "style": { "position": "absolute", "left": 20, "top": 95, "fontSize": 9, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },

    // Q2: Errors
    {
        "id": "md-q2-icon",
        "type": "icon",
        "name": "Icon2",
        "content": "warning",
        "style": { "position": "absolute", "left": 180, "top": 50, "width": 16, "height": 16, "fontSize": 16, "color": "#f59e0b" }
    },
    {
        "id": "md-q2-val",
        "type": "text",
        "name": "Val2",
        "content": "0.02%",
        "style": { "position": "absolute", "left": 180, "top": 70, "fontSize": 20, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "md-q2-lbl",
        "type": "text",
        "name": "Lbl2",
        "content": "Error Rate",
        "style": { "position": "absolute", "left": 180, "top": 95, "fontSize": 9, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },

    // Q3: Database
    {
        "id": "md-q3-icon",
        "type": "icon",
        "name": "Icon3",
        "content": "storage",
        "style": { "position": "absolute", "left": 20, "top": 130, "width": 16, "height": 16, "fontSize": 16, "color": "#8b5cf6" }
    },
    {
        "id": "md-q3-val",
        "type": "text",
        "name": "Val3",
        "content": "45ms",
        "style": { "position": "absolute", "left": 20, "top": 150, "fontSize": 20, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "md-q3-lbl",
        "type": "text",
        "name": "Lbl3",
        "content": "DB Latency",
        "style": { "position": "absolute", "left": 20, "top": 175, "fontSize": 9, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },

    // Q4: CPU
    {
        "id": "md-q4-icon",
        "type": "icon",
        "name": "Icon4",
        "content": "memory",
        "style": { "position": "absolute", "left": 180, "top": 130, "width": 16, "height": 16, "fontSize": 16, "color": "#10b981" }
    },
    {
        "id": "md-q4-val",
        "type": "text",
        "name": "Val4",
        "content": "32%",
        "style": { "position": "absolute", "left": 180, "top": 150, "fontSize": 20, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "md-q4-lbl",
        "type": "text",
        "name": "Lbl4",
        "content": "Cluster CPU",
        "style": { "position": "absolute", "left": 180, "top": 175, "fontSize": 9, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;