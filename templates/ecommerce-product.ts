import { Template } from '../types';

const template: Template = {
  "id": "ecommerce-prod",
  "name": "Product SKU",
  "description": "Product card with image, rating and stock level.",
  "category": "Analytics",
  "thumbnail": "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
  "canvasSettings": { 
    "width": 360, 
    "height": 140, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#e5e7eb",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "ep-img",
      "type": "image",
      "name": "ProductImage",
      "style": { "position": "absolute", "left": 15, "top": 15, "width": 110, "height": 110, "borderRadius": 8, "objectFit": "cover", "backgroundColor": "#f8fafc", "border": "1px solid #f3f4f6" },
      "chartProps": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80" },
      "animation": {
          "entry": { "type": "fade", "duration": 0.8, "delay": 0, "easing": "ease", "intensity": 50 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "ep-title",
      "type": "text",
      "name": "Title",
      "content": "Nike Air Max 270",
      "style": { "position": "absolute", "left": 140, "top": 15, "fontSize": 15, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ep-price",
      "type": "text",
      "name": "Price",
      "content": "$129.99",
      "style": { "position": "absolute", "left": 140, "top": 36, "fontSize": 14, "fontWeight": "600", "color": "#ef4444", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ep-star-bg",
      "type": "box",
      "name": "StarBg",
      "style": { "position": "absolute", "left": 285, "top": 15, "width": 60, "height": 24, "backgroundColor": "#fffbeb", "borderRadius": 12 }
    },
    {
      "id": "ep-star1",
      "type": "icon",
      "name": "StarIcon",
      "content": "star",
      "style": { "position": "absolute", "left": 292, "top": 19, "width": 16, "height": 16, "fontSize": 14, "color": "#fbbf24" }
    },
    {
      "id": "ep-rating",
      "type": "text",
      "name": "Rating",
      "content": "4.8",
      "style": { "position": "absolute", "left": 310, "top": 19, "fontSize": 11, "fontWeight": "bold", "color": "#92400e", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "ep-stock-lbl",
      "type": "text",
      "name": "StockLabel",
      "content": "Low Stock (12 left)",
      "style": { "position": "absolute", "left": 140, "top": 70, "fontSize": 10, "fontWeight": "600", "color": "#6b7280", "fontFamily": "Inter, sans-serif", "textTransform": "uppercase" }
    },
    {
      "id": "ep-bar",
      "type": "progress-bar",
      "name": "StockBar",
      "style": { "position": "absolute", "left": 140, "top": 88, "width": 205, "height": 6, "borderRadius": 4 },
      "chartProps": { "value": 20, "color": "#f59e0b", "backgroundColor": "#f3f4f6" },
      "animation": {
          "entry": { "type": "slide-right", "duration": 1, "delay": 0.3, "easing": "ease-out", "intensity": 50 },
          "hover": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "ep-buy-btn",
      "type": "box",
      "name": "RestockBtnBg",
      "style": { "position": "absolute", "left": 140, "top": 105, "width": 205, "height": 26, "backgroundColor": "#eff6ff", "borderRadius": 6, "cursor": "pointer" }
    },
    {
      "id": "ep-buy-txt",
      "type": "text",
      "name": "RestockBtn",
      "content": "REQUEST RESTOCK",
      "style": { "position": "absolute", "left": 140, "top": 105, "width": 205, "height": 26, "fontSize": 10, "fontWeight": "bold", "color": "#2563eb", "fontFamily": "Inter, sans-serif", "display": "flex", "alignItems": "center", "justifyContent": "center", "pointerEvents": "none" }
    }
  ]
};

export default template;