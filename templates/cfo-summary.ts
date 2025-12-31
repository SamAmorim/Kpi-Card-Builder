import { Template } from '../types';

const template: Template = {
  "id": "cfo-summary",
  "name": "CFO Scorecard",
  "description": "Multi-column financial summary showing Revenue, OpEx, and Net Profit.",
  "category": "Executive",
  "thumbnail": "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  "canvasSettings": { 
    "width": 420, 
    "height": 130, 
    "backgroundColor": "#ffffff",
    "borderRadius": 16,
    "borderColor": "#e2e8f0",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // --- COLUMN 1: REVENUE ---
    {
      "id": "cfo-rev-lbl",
      "type": "text",
      "name": "RevLabel",
      "content": "REVENUE",
      "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 10, "fontWeight": "bold", "color": "#64748b", "fontFamily": "Inter, sans-serif", "letterSpacing": "1px" }
    },
    {
      "id": "cfo-rev-val",
      "type": "text",
      "name": "RevValue",
      "content": "$8.4M",
      "style": { "position": "absolute", "left": 20, "top": 40, "fontSize": 20, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "cfo-rev-badge",
      "type": "text",
      "name": "RevGrowth",
      "content": "▲ 12%",
      "style": { "position": "absolute", "left": 20, "top": 70, "fontSize": 11, "fontWeight": "bold", "color": "#16a34a", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "cfo-rev-chart",
        "type": "sparkline",
        "name": "RevTrend",
        "style": { "position": "absolute", "left": 20, "top": 90, "width": 80, "height": 25 },
        "chartProps": { "dataPoints": [10, 12, 11, 14, 13, 16, 15, 18], "color": "#16a34a", "strokeWidth": 2 }
    },

    // DIVIDER 1
    {
        "id": "cfo-div-1",
        "type": "box",
        "name": "Divider1",
        "style": { "position": "absolute", "left": 140, "top": 20, "width": 1, "height": 90, "backgroundColor": "#e2e8f0" }
    },

    // --- COLUMN 2: EXPENSES ---
    {
      "id": "cfo-exp-lbl",
      "type": "text",
      "name": "ExpLabel",
      "content": "OPEX",
      "style": { "position": "absolute", "left": 160, "top": 20, "fontSize": 10, "fontWeight": "bold", "color": "#64748b", "fontFamily": "Inter, sans-serif", "letterSpacing": "1px" }
    },
    {
      "id": "cfo-exp-val",
      "type": "text",
      "name": "ExpValue",
      "content": "$3.2M",
      "style": { "position": "absolute", "left": 160, "top": 40, "fontSize": 20, "fontWeight": "bold", "color": "#0f172a", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "cfo-exp-badge",
      "type": "text",
      "name": "ExpGrowth",
      "content": "▼ 2%",
      "style": { "position": "absolute", "left": 160, "top": 70, "fontSize": 11, "fontWeight": "bold", "color": "#16a34a", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "cfo-exp-bar",
        "type": "progress-bar",
        "name": "ExpBudget",
        "style": { "position": "absolute", "left": 160, "top": 100, "width": 80, "height": 6, "borderRadius": 3 },
        "chartProps": { "value": 85, "color": "#f59e0b", "backgroundColor": "#f1f5f9" }
    },

    // DIVIDER 2
    {
        "id": "cfo-div-2",
        "type": "box",
        "name": "Divider2",
        "style": { "position": "absolute", "left": 280, "top": 20, "width": 1, "height": 90, "backgroundColor": "#e2e8f0" }
    },

    // --- COLUMN 3: PROFIT ---
    {
      "id": "cfo-net-lbl",
      "type": "text",
      "name": "NetLabel",
      "content": "EBITDA",
      "style": { "position": "absolute", "left": 300, "top": 20, "fontSize": 10, "fontWeight": "bold", "color": "#64748b", "fontFamily": "Inter, sans-serif", "letterSpacing": "1px" }
    },
    {
      "id": "cfo-net-val",
      "type": "text",
      "name": "NetValue",
      "content": "$5.2M",
      "style": { "position": "absolute", "left": 300, "top": 40, "fontSize": 20, "fontWeight": "bold", "color": "#3b82f6", "fontFamily": "Inter, sans-serif" }
    },
    {
        "id": "cfo-net-circle",
        "type": "circular-progress",
        "name": "MarginCircle",
        "style": { "position": "absolute", "left": 300, "top": 75, "width": 40, "height": 40 },
        "chartProps": { "value": 62, "color": "#3b82f6", "strokeWidth": 4, "backgroundColor": "#eff6ff" }
    },
    {
        "id": "cfo-net-pct",
        "type": "text",
        "name": "MarginPct",
        "content": "62%",
        "style": { "position": "absolute", "left": 350, "top": 88, "fontSize": 12, "fontWeight": "bold", "color": "#3b82f6", "fontFamily": "Inter, sans-serif" }
    }
  ]
};

export default template;