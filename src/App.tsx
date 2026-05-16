import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArcDetailPage from "./pages/ArcDetailPage";
import SagaPage from "./pages/SagaPage";
import WaveBackground from "./components/WaveBackground";
import ScrollToTop from "./components/ScrollToTop";

interface AppProps {
  basename?: string;
}

export default function App({ basename = import.meta.env.BASE_URL }: AppProps) {
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <WaveBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saga/:sagaId" element={<SagaPage />} />
        <Route path="/arc/:arcId" element={<ArcDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
