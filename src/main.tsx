import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import {HashRouter, Route, Routes} from 'react-router'
import Layout from './layout.tsx'
import Map2d from './app/map2d.tsx'
import Map3d from './app/map3d.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />} />
          <Route path="2d" element={<Map2d />} />
          <Route path="3d" element={<Map3d />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
