import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "src/pages/AuthPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};
