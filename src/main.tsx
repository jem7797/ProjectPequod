import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./Components/LandingPage.tsx";
import MainPage from "./Components/MainPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/main-page" element={<MainPage />} />

        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
