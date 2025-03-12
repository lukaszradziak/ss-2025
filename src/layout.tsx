import './style/layout.css'
import { NavLink, Outlet } from 'react-router'

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/2d">2D</NavLink>
        <NavLink to="/3d">3D</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout
