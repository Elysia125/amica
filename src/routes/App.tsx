import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/routes/HomePage";
import SharePage from "@/routes/SharePage";
import ImportPage from "@/routes/ImportPage";
import ImportSqidPage from "@/routes/ImportSqidPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/import/:sqid" element={<ImportSqidPage />} />
      </Routes>
    </HashRouter>
  );
}
