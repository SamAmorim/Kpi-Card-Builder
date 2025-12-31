import { Template } from '../types';

const template: Template = {
    "id": "metric-grid",
    "name": "Sales Grid Report",
    "description": "A table-like layout for displaying multiple metrics.",
    "category": "Chart",
    "thumbnail": "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
    "canvasSettings": {
        "width": 350,
        "height": 200,
        "backgroundColor": "#ffffff",
        "borderRadius": 12,
        "borderColor": "#e2e8f0",
        "borderWidth": 1,
        "borderStyle": "solid",
        "showShadow": true
    },
    "elements": [
        {
            "id": "mg-title",
            "type": "text",
            "name": "Title",
            "content": "Sales Breakdown",
            "style": { "position": "absolute", "left": 20, "top": 20, "fontSize": 16, "fontWeight": "bold", "color": "#1e293b" }
        },
        {
            "id": "mg-table",
            "type": "table",
            "name": "Grid",
            "style": { "position": "absolute", "left": 20, "top": 55, "width": 310, "height": 125, "backgroundColor": "#fff", "borderRadius": 8 },
            "tableProps": {
                "columns": [
                    { "id": "c1", "header": "Region", "width": 40 },
                    { "id": "c2", "header": "Value", "width": 30 },
                    { "id": "c3", "header": "YoY", "width": 30 }
                ],
                "rowHeight": 30,
                "headerBgColor": "#f8fafc",
                "headerColor": "#64748b",
                "rowBgColor": "#ffffff",
                "rowColor": "#334155",
                "gridColor": "#f1f5f9"
            }
        }
    ]
};

export default template;