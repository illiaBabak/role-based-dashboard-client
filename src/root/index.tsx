import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "src/pages/AuthPage";
import { DashboardPage } from "src/pages/DasboardPage";
import { NotFoundPage } from "src/pages/NotFoundPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
