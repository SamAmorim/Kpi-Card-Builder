import { Template } from '../types';

const template: Template = {
  "id": "sales-pipeline",
  "name": "Sales Pipeline",
  "description": "Funnel visualization of deal stages and conversion volume.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
  "canvasSettings": { 
    "width": 300, 
    "height": 220, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#fed7aa",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "sp-title",
      "type": "text",
      "name": "Title",
      "content": "Pipeline Velocity",
      "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 14, "fontWeight": "bold", "color": "#c2410c", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "sp-total",
      "type": "text",
      "name": "Total",
      "content": "$4.2M Total Value",
      "style": { "position": "absolute", "left": 20, "top": 38, "fontSize": 10, "color": "#fb923c", "fontFamily": "Inter, sans-serif", "fontWeight": "500" }
    },

    // Stage 1: Leads
    {
        "id": "sp-s1-bar",
        "type": "box",
        "name": "LeadsBar",
        "style": { "position": "absolute", "left": 20, "top": 70, "width": 260, "height": 30, "backgroundColor": "#fff7ed", "borderRadius": 6, "border": "1px solid #ffedd5" },
        "animation": {
            "entry": { "type": "slide-left", "duration": 0.5, "delay": 0.1, "easing": "ease-out", "intensity": 20 },
            "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "sp-s1-lbl",
        "type": "text",
        "name": "LeadsLbl",
        "content": "Leads",
        "style": { "position": "absolute", "left": 30, "top": 78, "fontSize": 11, "fontWeight": "600", "color": "#9a3412", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "sp-s1-val",
        "type": "text",
        "name": "LeadsVal",
        "content": "2,450",
        "style": { "position": "absolute", "left": 230, "top": 78, "fontSize": 11, "fontWeight": "bold", "color": "#c2410c", "fontFamily": "Inter, sans-serif", "textAlign": "right" }
    },

    // Stage 2: Qualified
    {
        "id": "sp-s2-bar",
        "type": "box",
        "name": "QualBar",
        "style": { "position": "absolute", "left": 40, "top": 105, "width": 220, "height": 30, "backgroundColor": "#ffedd5", "borderRadius": 6, "border": "1px solid #fed7aa" },
        "animation": {
            "entry": { "type": "slide-left", "duration": 0.5, "delay": 0.2, "easing": "ease-out", "intensity": 20 },
            "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "sp-s2-lbl",
        "type": "text",
        "name": "QualLbl",
        "content": "Qualified",
        "style": { "position": "absolute", "left": 50, "top": 113, "fontSize": 11, "fontWeight": "600", "color": "#9a3412", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "sp-s2-val",
        "type": "text",
        "name": "QualVal",
        "content": "840",
        "style": { "position": "absolute", "left": 210, "top": 113, "fontSize": 11, "fontWeight": "bold", "color": "#c2410c", "fontFamily": "Inter, sans-serif", "textAlign": "right" }
    },

    // Stage 3: Proposal
    {
        "id": "sp-s3-bar",
        "type": "box",
        "name": "PropBar",
        "style": { "position": "absolute", "left": 60, "top": 140, "width": 180, "height": 30, "backgroundColor": "#fed7aa", "borderRadius": 6, "border": "1px solid #fdba74" },
        "animation": {
            "entry": { "type": "slide-left", "duration": 0.5, "delay": 0.3, "easing": "ease-out", "intensity": 20 },
            "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "sp-s3-lbl",
        "type": "text",
        "name": "PropLbl",
        "content": "Proposal",
        "style": { "position": "absolute", "left": 70, "top": 148, "fontSize": 11, "fontWeight": "600", "color": "#9a3412", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "sp-s3-val",
        "type": "text",
        "name": "PropVal",
        "content": "320",
        "style": { "position": "absolute", "left": 190, "top": 148, "fontSize": 11, "fontWeight": "bold", "color": "#c2410c", "fontFamily": "Inter, sans-serif", "textAlign": "right" }
    },

    // Stage 4: Closed
    {
        "id": "sp-s4-bar",
        "type": "box",
        "name": "CloseBar",
        "style": { "position": "absolute", "left": 80, "top": 175, "width": 140, "height": 30, "backgroundColor": "#f97316", "borderRadius": 6, "border": "1px solid #ea580c" },
        "animation": {
            "entry": { "type": "slide-left", "duration": 0.5, "delay": 0.4, "easing": "ease-out", "intensity": 20 },
            "hover": { "type": "scale", "duration": 0.2, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    },
    {
        "id": "sp-s4-lbl",
        "type": "text",
        "name": "CloseLbl",
        "content": "Closed Won",
        "style": { "position": "absolute", "left": 90, "top": 183, "fontSize": 11, "fontWeight": "600", "color": "#ffffff", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "sp-s4-val",
        "type": "text",
        "name": "CloseVal",
        "content": "115",
        "style": { "position": "absolute", "left": 170, "top": 183, "fontSize": 11, "fontWeight": "bold", "color": "#ffffff", "fontFamily": "Inter, sans-serif", "textAlign": "right" }
    }
  ]
};

export default template;