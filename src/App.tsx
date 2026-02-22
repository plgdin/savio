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
      <Routes>
        {/* STANDALONE ROUTE: No global Layout. This lets the 3D Tunnel own the whole screen. */}
        <Route path="/" element={<Home />} />

        {/* NESTED ROUTES: These pages will still get the global navbar and footer from Layout */}
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