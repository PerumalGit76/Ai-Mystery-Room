import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreateCasePage from './pages/CreateCasePage.jsx';
import InvestigationPage from './pages/InvestigationPage.jsx';
import AccusationPage from './pages/AccusationPage.jsx';
import VerdictPage from './pages/VerdictPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateCasePage />} />
    <Route path="/case/:caseId" element={<InvestigationPage />} />
    <Route path="/case/:caseId/accuse" element={<AccusationPage />} />
    <Route path="/case/:caseId/verdict" element={<VerdictPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
