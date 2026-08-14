import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';

// 子页面与编辑器按需加载：首屏只包含首页与旅程代码
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TechThoughts = lazy(() => import('./pages/TechThoughts'));
const Admin = lazy(() => import('./pages/Admin'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/thoughts" element={<TechThoughts />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}