import { Template } from '../types';

const template: Template = {
  "id": "crypto-asset",
  "name": "Asset Ticker",
  "description": "Dark themed card for crypto or stock assets with neon graph.",
  "category": "Dark UI",
  "thumbnail": "linear-gradient(135deg, #111827 0%, #000 100%)",
  "canvasSettings": { 
    "width": 300, 
    "height": 150, 
    "backgroundColor": "#111827",
    "borderRadius": 16,
    "borderColor": "#374151",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    // Header
    {
      "id": "ca-icon-bg",
      "type": "box",
      "name": "IconBg",
      "style": { "position": "absolute", "left": 20, "top": 20, "width": 36, "height": 36, "backgroundColor": "#374151", "borderRadius": 18 }
    },
    {
      "id": "ca-icon",
      "type": "icon",
      "name": "Icon",
      "content": "euro",
      "style": { "position": "absolute", "left": 26, "top": 26, "width": 24, "height": 24, "fontSize": 20, "color": "#ffffff" }
    },
    {
      "id": "ca-name",
      "type": "text",
      "name": "AssetName",
      "content": "Bitcoin",
      "style": { "position": "absolute", "left": 65, "top": 20, "fontSize": 14, "fontWeight": "bold", "color": "#ffffff", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ca-ticker",
      "type": "text",
      "name": "Ticker",
      "content": "BTC / USD",
      "style": { "position": "absolute", "left": 65, "top": 38, "fontSize": 11, "fontWeight": "500", "color": "#9ca3af", "fontFamily": "Inter, sans-serif" }
    },
    
    // Price
    {
      "id": "ca-price",
      "type": "text",
      "name": "Price",
      "content": "$42,505.20",
      "style": { "position": "absolute", "left": 20, "top": 70, "fontSize": 28, "fontWeight": "bold", "color": "#ffffff", "fontFamily": "JetBrains Mono, monospace", "letterSpacing": "-1px" },
      "animation": {
          "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "pulse", "duration": 1, "delay": 0, "easing": "ease-out", "intensity": 20, "infinite": false } // Simulate tick update
      }
    },
    {
      "id": "ca-change",
      "type": "text",
      "name": "Change",
      "content": "+5.24%",
      "style": { "position": "absolute", "left": 220, "top": 25, "fontSize": 12, "fontWeight": "bold", "color": "#4ade80", "fontFamily": "JetBrains Mono, monospace", "textAlign": "right", "width": 60 }
    },

    // Chart
    {
        "id": "ca-chart",
        "type": "area-chart",
        "name": "Sparkline",
        "style": { "position": "absolute", "left": 0, "top": 100, "width": 300, "height": 50, "opacity": 0.8 },
        "chartProps": { 
            "dataPoints": [41000, 41500, 41200, 42000, 41800, 42505], 
            "color": "#4ade80", 
            "backgroundColor": "#22c55e", // Used as fill for area chart
            "strokeWidth": 2 
        },
        "animation": {
            "entry": { "type": "slide-up", "duration": 1, "delay": 0.2, "easing": "ease-out", "intensity": 30 },
            "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 2 },
            "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
        }
    }
  ]
};

export default template;