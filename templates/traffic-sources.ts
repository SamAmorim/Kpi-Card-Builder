import { Template } from '../types';

const template: Template = {
  "id": "traffic-sources",
  "name": "Traffic Sources",
  "description": "Channel breakdown with comparative progress bars.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
  "canvasSettings": { 
    "width": 300, 
    "height": 240, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#e5e7eb",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "ts-title",
      "type": "text",
      "name": "Title",
      "content": "Top Channels",
      "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 14, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ts-dot",
      "type": "box",
      "name": "LiveDot",
      "style": { "position": "absolute", "left": 270, "top": 24, "width": 8, "height": 8, "backgroundColor": "#22c55e", "borderRadius": 4 },
      "animation": {
          "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 2, "delay": 0, "easing": "ease-in-out", "intensity": 60, "infinite": true }
      }
    },

    // ROW 1: Direct
    {
      "id": "ts-r1-lbl",
      "type": "text",
      "name": "R1_Label",
      "content": "Direct",
      "style": { "position": "absolute", "left": 20, "top": 60, "fontSize": 11, "fontWeight": "600", "color": "#4b5563", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ts-r1-val",
      "type": "text",
      "name": "R1_Value",
      "content": "45%",
      "style": { "position": "absolute", "left": 250, "top": 60, "fontSize": 11, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 30 }
    },
    {
      "id": "ts-r1-bar",
      "type": "progress-bar",
      "name": "R1_Bar",
      "style": { "position": "absolute", "left": 20, "top": 80, "width": 260, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 45, "color": "#3b82f6", "backgroundColor": "#eff6ff" }
    },

    // ROW 2: Organic Search
    {
      "id": "ts-r2-lbl",
      "type": "text",
      "name": "R2_Label",
      "content": "Organic Search",
      "style": { "position": "absolute", "left": 20, "top": 105, "fontSize": 11, "fontWeight": "600", "color": "#4b5563", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ts-r2-val",
      "type": "text",
      "name": "R2_Value",
      "content": "32%",
      "style": { "position": "absolute", "left": 250, "top": 105, "fontSize": 11, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 30 }
    },
    {
      "id": "ts-r2-bar",
      "type": "progress-bar",
      "name": "R2_Bar",
      "style": { "position": "absolute", "left": 20, "top": 125, "width": 260, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 32, "color": "#10b981", "backgroundColor": "#ecfdf5" }
    },

    // ROW 3: Social
    {
      "id": "ts-r3-lbl",
      "type": "text",
      "name": "R3_Label",
      "content": "Social Media",
      "style": { "position": "absolute", "left": 20, "top": 150, "fontSize": 11, "fontWeight": "600", "color": "#4b5563", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ts-r3-val",
      "type": "text",
      "name": "R3_Value",
      "content": "18%",
      "style": { "position": "absolute", "left": 250, "top": 150, "fontSize": 11, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 30 }
    },
    {
      "id": "ts-r3-bar",
      "type": "progress-bar",
      "name": "R3_Bar",
      "style": { "position": "absolute", "left": 20, "top": 170, "width": 260, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 18, "color": "#8b5cf6", "backgroundColor": "#f5f3ff" }
    },

    // ROW 4: Referral
    {
      "id": "ts-r4-lbl",
      "type": "text",
      "name": "R4_Label",
      "content": "Referral",
      "style": { "position": "absolute", "left": 20, "top": 195, "fontSize": 11, "fontWeight": "600", "color": "#4b5563", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ts-r4-val",
      "type": "text",
      "name": "R4_Value",
      "content": "5%",
      "style": { "position": "absolute", "left": 250, "top": 195, "fontSize": 11, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif", "textAlign": "right", "width": 30 }
    },
    {
      "id": "ts-r4-bar",
      "type": "progress-bar",
      "name": "R4_Bar",
      "style": { "position": "absolute", "left": 20, "top": 215, "width": 260, "height": 6, "borderRadius": 3 },
      "chartProps": { "value": 5, "color": "#f59e0b", "backgroundColor": "#fffbeb" }
    }
  ]
};

export default template;