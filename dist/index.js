"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client")); // Use 'react-dom/client' instead of 'react-dom'
const App = () => {
    return react_1.default.createElement("h1", null, "Hello, React and TypeScript!");
};
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = client_1.default.createRoot(rootElement); // Create a root
    root.render(react_1.default.createElement(App, null)); // Render the App
}
