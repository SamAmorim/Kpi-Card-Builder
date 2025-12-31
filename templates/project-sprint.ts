import { Template } from '../types';

const template: Template = {
  "id": "project-sprint",
  "name": "Sprint Velocity",
  "description": "Agile project tracking with timeline, team avatars and task completion.",
  "category": "Card",
  "thumbnail": "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  "canvasSettings": { 
    "width": 320, 
    "height": 160, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e2e8f0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header
    {
      "id": "ps-tag-bg",
      "type": "box",
      "name": "TagBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 70, "height": 24, "backgroundColor": "#e0f2fe", "borderRadius": 6 }
    },
    {
      "id": "ps-tag-txt",
      "type": "text",
      "name": "TagTxt",
      "content": "SPRINT 42",
      "style": { "position": "absolute", "left": 20, "top": 24, "width": 70, "textAlign": "center", "fontSize": 10, "fontWeight": "bold", "color": "#0284c7", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ps-title",
      "type": "text",
      "name": "Title",
      "content": "Mobile App Redesign",
      "style": { "position": "absolute", "left": 20, "top": 55, "fontSize": 16, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },
    
    // Progress
    {
      "id": "ps-prog-lbl",
      "type": "text",
      "name": "ProgLabel",
      "content": "65% Complete",
      "style": { "position": "absolute", "left": 240, "top": 58, "fontSize": 10, "fontWeight": "600", "color": "#64748b", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 60 }
    },
    {
      "id": "ps-prog-bar",
      "type": "progress-bar",
      "name": "ProgressBar",
      "style": { "position": "absolute", "left": 20, "top": 85, "width": 280, "height": 8, "borderRadius": 4 },
      "chartProps": { "value": 65, "color": "#0ea5e9", "backgroundColor": "#f1f5f9" },
      "animation": {
          "entry": { "type": "slide-right", "duration": 1, "delay": 0.2, "easing": "ease-out", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },

    // Footer - Team & Time
    {
        "id": "ps-team-1",
        "type": "image",
        "name": "Avatar1",
        "style": { "position": "absolute", "left": 20, "top": 110, "width": 32, "height": 32, "borderRadius": 16, "border": "2px solid white", "zIndex": 3 },
        "chartProps": { "imageUrl": "https://i.pravatar.cc/150?img=33" }
    },
    {
        "id": "ps-team-2",
        "type": "image",
        "name": "Avatar2",
        "style": { "position": "absolute", "left": 45, "top": 110, "width": 32, "height": 32, "borderRadius": 16, "border": "2px solid white", "zIndex": 2 },
        "chartProps": { "imageUrl": "https://i.pravatar.cc/150?img=12" }
    },
    {
        "id": "ps-team-3",
        "type": "image",
        "name": "Avatar3",
        "style": { "position": "absolute", "left": 70, "top": 110, "width": 32, "height": 32, "borderRadius": 16, "border": "2px solid white", "zIndex": 1 },
        "chartProps": { "imageUrl": "https://i.pravatar.cc/150?img=59" }
    },
    
    {
        "id": "ps-clock-icon",
        "type": "icon",
        "name": "Clock",
        "content": "schedule",
        "style": { "position": "absolute", "left": 215, "top": 118, "width": 16, "height": 16, "fontSize": 16, "color": "#94a3b8" }
    },
    {
        "id": "ps-time-txt",
        "type": "text",
        "name": "DaysLeft",
        "content": "3 days left",
        "style": { "position": "absolute", "left": 235, "top": 118, "fontSize": 11, "fontWeight": "500", "color": "#64748b", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;