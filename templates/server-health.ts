import { Template } from '../types';

const template: Template = {
  "id": "server-health",
  "name": "System Health",
  "description": "Technical dashboard for server monitoring.",
  "category": "Dark UI",
  "thumbnail": "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
  "canvasSettings": { 
    "width": 360, 
    "height": 220, 
    "backgroundColor": "#0f172a",
    "borderRadius": 8,
    "borderColor": "#334155",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "sh-header",
      "type": "text",
      "name": "ServerName",
      "content": "US-EAST-1",
      "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 14, "fontWeight": "bold", "color": "#f8fafc", "fontFamily": "JetBrains Mono, monospace", "letterSpacing": "1px" }
    },
    {
      "id": "sh-status-dot",
      "type": "box",
      "name": "StatusDot",
      "style": { "position": "absolute", "left": 250, "top": 22, "width": 8, "height": 8, "backgroundColor": "#22c55e", "borderRadius": 4 },
      "animation": {
          "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 2, "delay": 0, "easing": "ease-in-out", "intensity": 60, "infinite": true }
      }
    },
    {
      "id": "sh-status-txt",
      "type": "text",
      "name": "StatusTxt",
      "content": "OPERATIONAL",
      "style": { "position": "absolute", "left": 265, "top": 20, "fontSize": 10, "fontWeight": "bold", "color": "#22c55e", "fontFamily": "JetBrains Mono, monospace" }
    },
    {
      "id": "sh-div-1",
      "type": "box",
      "name": "Divider1",
      "style": { "position": "absolute", "left": 20, "top": 50, "width": 320, "height": 1, "backgroundColor": "#1e293b" }
    },
    
    // CPU Section
    {
      "id": "sh-cpu-lbl",
      "type": "text",
      "name": "CPULabel",
      "content": "CPU USAGE",
      "style": { "position": "absolute", "left": 20, "top": 65, "fontSize": 10, "color": "#94a3b8", "fontFamily": "JetBrains Mono, monospace" }
    },
    {
      "id": "sh-cpu-val",
      "type": "text",
      "name": "CPUVal",
      "content": "42%",
      "style": { "position": "absolute", "left": 310, "top": 65, "fontSize": 12, "fontWeight": "bold", "color": "#60a5fa", "fontFamily": "JetBrains Mono, monospace" }
    },
    {
      "id": "sh-cpu-chart",
      "type": "sparkline",
      "name": "CPUChart",
      "style": { "position": "absolute", "left": 20, "top": 85, "width": 320, "height": 30 },
      "chartProps": { "dataPoints": [30, 45, 40, 60, 55, 42, 48, 42], "color": "#3b82f6", "strokeWidth": 2 }
    },

    // Memory Section
    {
      "id": "sh-mem-lbl",
      "type": "text",
      "name": "MemLabel",
      "content": "MEMORY",
      "style": { "position": "absolute", "left": 20, "top": 125, "fontSize": 10, "color": "#94a3b8", "fontFamily": "JetBrains Mono, monospace" }
    },
    {
      "id": "sh-mem-val",
      "type": "text",
      "name": "MemVal",
      "content": "12.4 GB",
      "style": { "position": "absolute", "left": 290, "top": 125, "fontSize": 12, "fontWeight": "bold", "color": "#c084fc", "fontFamily": "JetBrains Mono, monospace" }
    },
    {
      "id": "sh-mem-bar",
      "type": "progress-bar",
      "name": "MemBar",
      "style": { "position": "absolute", "left": 20, "top": 145, "width": 320, "height": 6, "borderRadius": 2 },
      "chartProps": { "value": 65, "color": "#a855f7", "backgroundColor": "#1e293b" }
    },

    // Latency
    {
        "id": "sh-lat-icon",
        "type": "icon",
        "name": "NetIcon",
        "content": "bolt",
        "style": { "position": "absolute", "left": 20, "top": 180, "width": 16, "height": 16, "fontSize": 16, "color": "#fbbf24" }
    },
    {
        "id": "sh-lat-txt",
        "type": "text",
        "name": "NetTxt",
        "content": "Latency: 24ms",
        "style": { "position": "absolute", "left": 45, "top": 180, "fontSize": 11, "color": "#cbd5e1", "fontFamily": "JetBrains Mono, monospace" }
    }
  ]
};

export default template;