import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "src/pages/AuthPage";
import { DashboardPage } from "src/pages/DasboardPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};
