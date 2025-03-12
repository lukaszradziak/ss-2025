import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HashRouter, Route, Routes} from 'react-router'
import Layout from './layout'
import Index from './routes/index'
import Map2d from './routes/map2d'
import Map3d from './routes/map3d'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="2d" element={<Map2d />} />
          <Route path="3d" element={<Map3d />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
