import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { StudyStoreProvider, useStudyStore } from "./store/useStudyStore";
import { AppLayout } from "./layout/AppLayout";
import { Home } from "./pages/Home";
import { WordsList } from "./pages/WordsList";
import { WordsCards } from "./pages/WordsCards";
import { StudyBuilder } from "./pages/StudyBuilder";
import { StudySession } from "./pages/StudySession";
import { Plan } from "./pages/Plan";
import { LessonCards } from "./pages/LessonCards";
import { Stats } from "./pages/Stats";
import { Settings } from "./pages/Settings";
import { Reading } from "./pages/Reading";

function ThemeSync() {
  const { data } = useStudyStore();

  useEffect(() => {
    document.documentElement.dataset.theme = data.settings.theme;
  }, [data.settings.theme]);

  return null;
}

function RootRedirect() {
  const { data } = useStudyStore();
  return <Navigate to={`/${data.settings.language}`} replace />;
}

export default function App() {
  return (
    <StudyStoreProvider>
      <ThemeSync />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="words" element={<Navigate to="words/1" replace />} />
          <Route path="words/:level" element={<WordsList />} />
          <Route path="words/:level/cards" element={<WordsCards />} />
          <Route path="study" element={<StudyBuilder />} />
          <Route path="study/session" element={<StudySession />} />
          <Route path="plan" element={<Plan />} />
          <Route path="plan/:planId/lesson/:lessonId" element={<LessonCards />} />
          <Route path="reading" element={<Reading />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </StudyStoreProvider>
  );
}
