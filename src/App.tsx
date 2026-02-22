import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import WorkList from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      {/* 1. We keep the grid, but REMOVED the noise-overlay line from here */}
      <div className="framer-grid" />

      <Routes>
        {/* STANDALONE ROUTE */}
        <Route path="/" element={<Home />} />

        {/* NESTED ROUTES */}
        <Route element={<Layout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/work" element={<WorkList />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;