# Power BI HTML KPI Builder ⚡

> Create stunning, custom HTML/CSS visuals for Power BI without writing a single line of complex DAX string concatenation.

![Status: MVP](https://img.shields.io/badge/Status-MVP-blue) ![License: MIT](https://img.shields.io/badge/License-MIT-green) ![Power BI](https://img.shields.io/badge/Power%20BI-F2C811?logo=powerbi&logoColor=black)

## 🎯 The Purpose
Leveraging native HTML & CSS within Power BI measures allows for incredible design flexibility. However, the implementation is often a manual, error-prone process of escaping characters and concatenating DAX strings.

**Power BI HTML KPI Builder** solves this by acting as a bridge: you configure the visual design, and the tool outputs the sanitized, ready-to-deploy DAX code.

## 🚀 Key Features
* **Automated DAX Generation:** Instantly converts your design settings into valid DAX measures.
* **Design Customization:** configure colors, icons, and labels through a UI instead of code.
* **Theme Awareness:** Built-in logic for Light and Dark modes.
* **Clean Output:** Generates readable code that is easy to maintain.

## 🛠 Roadmap
This project is currently in MVP stage. Future updates aim to expand into a full styling platform:

- [ ] **Template Repository:** Library of pre-built card designs (Neuromorphism, Glassmorphism, etc).
- [ ] **Drag & Drop Editor:** Visual interface for layout adjustments.
- [ ] **JSON Export:** Ability to save and share template configurations.

## 📖 How to Use
1.  **Access the Builder:** [Insert Link to Live Tool Here]
2.  **Configure:** Select your visual style and toggle settings.
3.  **Generate:** Click to generate the DAX code.
4.  **Deploy:**
    * Copy the code.
    * Create a new **Measure** in Power BI.
    * Paste the code.
    * *Crucial:* Replace the placeholder variables (e.g., `_Value`, `_Goal`) with your actual dataset references.
5.  **Visualize:** Use the "New Card" visual (or HTML Content custom visual) to render the measure.

## 🤝 Contributing
Contributions are welcome! Whether it's reporting a bug, suggesting a new template, or improving the DAX generation logic.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.