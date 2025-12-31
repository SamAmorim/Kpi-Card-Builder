import { Template } from '../types';

const template: Template = {
  "id": "profile-card",
  "name": "Agent Performance",
  "description": "Employee profile with top-level metrics, status, and goal progress.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  "canvasSettings": { 
    "width": 320, 
    "height": 180, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e2e8f0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // --- Header Background (Gradient + Z-Index 0) ---
    {
      "id": "p1-header-bg",
      "type": "box",
      "name": "HeaderBg",
      "style": { "position": "absolute", "left": 0, "top": 0, "width": 320, "height": 60, "background": "linear-gradient(120deg, #3b82f6, #6366f1)", "borderRadius": 0, "borderTopLeftRadius": 15, "borderTopRightRadius": 15, "zIndex": 0 }
    },
    
    // --- Avatar Section (Shadow + Border + Circle) ---
    {
      "id": "p1-img",
      "type": "image",
      "name": "Avatar",
      "style": { "position": "absolute", "left": 20, "top": 30, "width": 64, "height": 64, "borderRadius": 200, "border": "3px solid #ffffff", "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)", "zIndex": 2, "backgroundColor": "#f1f5f9" },
      "chartProps": { "imageUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      "animation": {
          "entry": { "type": "scale", "duration": 0.5, "delay": 0.1, "easing": "elastic", "intensity": 30 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    // Status Dot
    {
      "id": "p1-status",
      "type": "box",
      "name": "StatusDot",
      "style": { "position": "absolute", "left": 68, "top": 78, "width": 12, "height": 12, "backgroundColor": "#22c55e", "borderRadius": 200, "border": "2px solid #ffffff", "zIndex": 3 },
      "animation": {
          "entry": { "type": "scale", "duration": 0.3, "delay": 0.5, "easing": "bounce-out", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 2, "delay": 0, "easing": "ease-in-out", "intensity": 60, "infinite": true }
      }
    },

    // --- Info Section ---
    {
      "id": "p1-name",
      "type": "text",
      "name": "Name",
      "content": "Sarah Johnson",
      "style": { "position": "absolute", "left": 95, "top": 65, "fontSize": 16, "fontWeight": "bold", "color": "#1e293b", "fontFamily": "Inter, sans-serif", "zIndex": 1 }
    },
    {
      "id": "p1-role",
      "type": "text",
      "name": "Role",
      "content": "Senior Account Exec.",
      "style": { "position": "absolute", "left": 95, "top": 84, "fontSize": 11, "color": "#64748b", "fontFamily": "Inter, sans-serif", "zIndex": 1 }
    },
    {
      "id": "p1-badge",
      "type": "text",
      "name": "TopPerformer",
      "content": "★ TOP RATED",
      "style": { "position": "absolute", "left": 230, "top": 70, "fontSize": 9, "fontWeight": "bold", "color": "#eab308", "backgroundColor": "#fef9c3", "padding": "4px 8px", "borderRadius": "10px", "fontFamily": "Inter, sans-serif", "zIndex": 1, "letterSpacing": "0.5px" }
    },

    // --- Metrics Grid ---
    {
        "id": "p1-div",
        "type": "box",
        "name": "Divider",
        "style": { "position": "absolute", "left": 20, "top": 110, "width": 280, "height": 1, "backgroundColor": "#f1f5f9", "zIndex": 0 }
    },
    
    // Metric 1: Sales
    {
        "id": "p1-m1-lbl",
        "type": "text",
        "name": "Label1",
        "content": "Sales",
        "style": { "position": "absolute", "left": 20, "top": 120, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "p1-m1-val",
        "type": "text",
        "name": "Val1",
        "content": "$124k",
        "style": { "position": "absolute", "left": 20, "top": 134, "fontSize": 14, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },

    // Metric 2: CSAT
    {
        "id": "p1-m2-lbl",
        "type": "text",
        "name": "Label2",
        "content": "CSAT",
        "style": { "position": "absolute", "left": 100, "top": 120, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "p1-m2-val",
        "type": "text",
        "name": "Val2",
        "content": "4.9/5",
        "style": { "position": "absolute", "left": 100, "top": 134, "fontSize": 14, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },

    // Metric 3: Deals
    {
        "id": "p1-m3-lbl",
        "type": "text",
        "name": "Label3",
        "content": "Deals",
        "style": { "position": "absolute", "left": 180, "top": 120, "fontSize": 10, "color": "#94a3b8", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "p1-m3-val",
        "type": "text",
        "name": "Val3",
        "content": "24",
        "style": { "position": "absolute", "left": 180, "top": 134, "fontSize": 14, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },

    // --- Bottom Goal Progress ---
    {
      "id": "p1-goal-lbl",
      "type": "text",
      "name": "GoalLbl",
      "content": "Monthly Quota (92%)",
      "style": { "position": "absolute", "left": 20, "top": 160, "fontSize": 9, "fontWeight": "600", "color": "#64748b", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "p1-goal-bar",
      "type": "progress-bar",
      "name": "GoalBar",
      "style": { "position": "absolute", "left": 120, "top": 163, "width": 180, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 92, "color": "#3b82f6", "backgroundColor": "#eff6ff" },
      "animation": {
          "entry": { "type": "slide-right", "duration": 1, "delay": 0.4, "easing": "ease-out", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    }
  ]
};

export default template;