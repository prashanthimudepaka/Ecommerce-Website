import { StrictMode } from 'react'      //Helps catch potential issues (like deprecated APIs) in development mode.
import { createRoot } from 'react-dom/client'  // Enables concurrent rendering (better handling of UI updates).
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' //Enables client-side routing using react-router-dom. 
createRoot(document.getElementById("root")).render(  //Mounts the React app inside the <div id="root"> in index.html
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter> 
    </StrictMode>
)



