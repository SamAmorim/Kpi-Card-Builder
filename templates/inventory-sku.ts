import { Template } from '../types';

const template: Template = {
  "id": "inventory-sku",
  "name": "Inventory Item",
  "description": "Compact SKU card with image and stock status.",
  "category": "Card",
  "thumbnail": "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  "canvasSettings": { 
    "width": 280, 
    "height": 120, 
    "backgroundColor": "#ffffff",
    "borderRadius": 12,
    "borderColor": "#e5e7eb",
    "borderWidth": 1,
    "borderStyle": "solid",
    "showShadow": true
  },
  "elements": [
    {
      "id": "inv-img",
      "type": "image",
      "name": "ProductThumb",
      "style": { "position": "absolute", "left": 15, "top": 15, "width": 90, "height": 90, "borderRadius": 8, "objectFit": "cover", "backgroundColor": "#f9fafb" },
      "chartProps": { "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80" },
      "animation": {
          "entry": { "type": "fade", "duration": 0.5, "delay": 0, "easing": "ease", "intensity": 50 },
          "hover": { "type": "scale", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 5 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    },
    {
      "id": "inv-sku",
      "type": "text",
      "name": "SKU",
      "content": "SKU-90210",
      "style": { "position": "absolute", "left": 115, "top": 15, "fontSize": 10, "fontWeight": "bold", "color": "#6b7280", "fontFamily": "Inter, sans-serif", "letterSpacing": "0.5px" }
    },
    {
      "id": "inv-name",
      "type": "text",
      "name": "ProdName",
      "content": "Smart Watch Series 7",
      "style": { "position": "absolute", "left": 115, "top": 30, "fontSize": 14, "fontWeight": "bold", "color": "#111827", "fontFamily": "Inter, sans-serif", "width": 150 }
    },
    {
      "id": "inv-bg-badge",
      "type": "box",
      "name": "StockBadgeBg",
      "style": { "position": "absolute", "left": 115, "top": 80, "width": 80, "height": 24, "backgroundColor": "#eff6ff", "borderRadius": 6 }
    },
    {
      "id": "inv-txt-badge",
      "type": "text",
      "name": "StockText",
      "content": "In Stock: 45",
      "style": { "position": "absolute", "left": 122, "top": 84, "fontSize": 11, "fontWeight": "600", "color": "#2563eb", "fontFamily": "Inter, sans-serif" }
    },
    {
      "id": "inv-icon",
      "type": "icon",
      "name": "CartIcon",
      "content": "shopping_cart",
      "style": { "position": "absolute", "left": 240, "top": 80, "width": 24, "height": 24, "fontSize": 18, "color": "#9ca3af", "display": "flex", "alignItems": "center", "justifyContent": "center", "cursor": "pointer" },
      "animation": {
          "entry": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 },
          "hover": { "type": "rotate", "duration": 0.3, "delay": 0, "easing": "ease", "intensity": 20 },
          "idle": { "type": "none", "duration": 0, "delay": 0, "easing": "linear", "intensity": 0 }
      }
    }
  ]
};

export default template;