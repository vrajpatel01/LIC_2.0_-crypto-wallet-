import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MainProvider } from "./context/useMainContext.jsx";
import Wrapper from "./components/wrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Wrapper>
      <MainProvider>
        <App />
      </MainProvider>
    </Wrapper>
  </StrictMode>
);
