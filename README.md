# SIP Calculator - Smart Investment Planning

A comprehensive Systematic Investment Plan (SIP) calculator with support for Regular, Step-up, and Flexible SIP calculations. Features a modern, responsive design with interactive charts and advanced navigation.

---

## ✨ Features

* **Multiple SIP Types**: Regular, Step-up, and Flexible SIP calculations
* **Investment Categories**: Large Cap (10%), Mid Cap (12%), Small Cap (15%) funds
* **Advanced Options**: Inflation adjustment, goal-based planning
* **Interactive Charts**: Compact pie and line charts using Chart.js
* **PDF Export**: Generate detailed PDF reports
* **Responsive Design**: Optimized layout across desktop, tablet, and mobile
* **Dark/Light Theme**: Smooth theme toggle with persistence
* **Data Persistence**: Save and restore calculation drafts
* **Real-time Validation**: Form validation with clear error messages
* **Navigation Support**: Back/forward buttons and URL sync

---

## 🚀 Recent Updates & Fixes

### ✅ Major Fixes

1. **Black Screen After "Compare All SIP Types"**

   * Fixed comparison section visibility issues
   * Improved error handling and state management for missing or malformed input

2. **Browser Navigation Issues**

   * Implemented full browser history management
   * Ensured URL state sync with navigation actions

3. **Chart Rendering Bugs**

   * Fixed issues with charts not rendering after tab switches or page reloads
   * Optimized chart destruction and redraw logic to prevent memory leaks

4. **Dark Mode Persistence**

   * Resolved inconsistencies in theme state across pages and sessions
   * Implemented localStorage-based theme toggling with default fallback

5. **Cross-Page Data Sync**

   * Fixed issues where user input wasn’t persisting across tabs (index → results → compare)
   * Ensured localStorage usage is isolated, validated, and reset correctly

6. **Form Validation Edge Cases**

   * Fixed crashes or wrong results for edge inputs (zero/negative values, extremely large investments)
   * Added robust type checks and number formatting for user inputs

7. **Mobile Usability**

   * Fixed unscrollable or clipped chart areas on smaller screens
   * Improved touch target sizes and alignment in smaller viewports

---

## 🎨 UI/UX Improvements

* **Compact Charts**: Shorter heights for all devices
* **Reduced Spacing**: Tighter layout throughout results section
* **Improved Typography**: Cleaner, more readable fonts
* **Touch-Friendly Controls**: Optimized for all screen types

---

## 📱 Responsive Design

Fully responsive interface with adaptive layouts:

* **Desktop**: Full-featured layout with side-by-side charts
* **Tablet/Mobile**: Single-column layout with compact, responsive visuals

---

## 🛠️ Technical Details

### Libraries Used:

* **Chart.js** – Chart rendering
* **jsPDF** – PDF generation
* **Inter Font** – Clean, modern typography

### Browser Support:

* Chrome 80+
* Firefox 75+
* Safari 13+
* Edge 80+

### File Structure:

```
project/
├── index.html
├── js/
│   ├── main.js
│   ├── calculations.js
│   ├── charts.js
│   ├── storage.js
│   ├── utils.js
│   └── validation.js
├── styles/
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── test.html
└── DEMO.md
```

---

## 🎯 Usage Guide

### Getting Started:

1. Open the application in your browser
2. Select a SIP type: Regular, Step-up, or Flexible
3. Enter the investment details and optional advanced inputs
4. Click **"Calculate SIP"**
5. View detailed results with compact interactive charts
6. Use **"Compare All SIP Types"** for analysis
7. Export your results as a PDF

### Navigation:

* Use browser back/forward buttons
* Navigation buttons like “Back to Results” and “Modify Calculation”
* URL reflects navigation state

---

## 🔧 Error Handling

* **Library Fallbacks**: Handles missing scripts gracefully
* **Form Validation**: Real-time checks with clear messages
* **Chart & PDF Failures**: Recovery for rendering/export issues
* **Navigation Recovery**: Handles invalid steps or reloads

---

## 📊 Chart Features

* **Compact Design**: Pie + Line charts, optimized for all screen sizes
* **Interactivity**: Tooltips, animations, and responsive resizing
* **Theme Awareness**: Charts adapt to dark/light mode
* **High-Quality Export**: Ready for PDF reports

---

## 🥚 Development

### Run Locally:

```bash
python -m http.server 8000
```

Then visit: `http://localhost:8000`

Or simply open `index.html` in your browser.

### Testing:

* Use `test.html` to verify core features
* Open browser console for debugging or inspecting issues

---

## 🐛 Troubleshooting

| Issue              | Solution                       |
| ------------------ | ------------------------------ |
| Charts not showing | Ensure Chart.js is loaded      |
| PDF not generating | Check jsPDF availability       |
| Input not accepted | Review validation messages     |
| Layout breaks      | Clear cache and reload         |
| Navigation glitch  | Use browser console for errors |

---

## 📊 Performance

* Lazy loading for charts
* Minimal DOM manipulation
* Memory cleanup on chart refresh
* Optimized images and responsive rendering

---

## 🔒 Privacy & Security

* All data stored locally (browser storage)
* No analytics or third-party tracking
* 100% client-side app — no server interaction

---

## 📄 License

This project is for educational use only. Consult a certified financial advisor for actual investment decisions.

---

## ⚠️ Disclaimer

This calculator is for illustration and educational purposes. Actual returns may vary. Mutual fund investments are subject to market risks. Please read all scheme documents carefully.

---
