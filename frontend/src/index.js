/* 
  File Name: index.js
  Description: This file serves as the entry point for the React application.
               It is responsible for rendering the main App component into the 
               DOM, which is the starting point of the React app.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

// Import React library to allow JSX syntax and React features
import React from 'react';

// Import ReactDOM to render the React components into the DOM
import ReactDOM from "react-dom/client";

// Import global CSS styles for the application
import "./index.css";

// Import the main App component which serves as the root of the application
import App from "./App"

// Create a root DOM element where the React app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root DOM element
root.render(<App />);
