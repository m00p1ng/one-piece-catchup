import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArcDetailPage from "./pages/ArcDetailPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/arc/:arcId" element={<ArcDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
