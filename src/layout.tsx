import { NavLink, Outlet } from 'react-router'

function Layout() {
  return (
    <div>
      <div style={{display: 'flex', gap: '10px'}}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/2d">2D</NavLink>
        <NavLink to="/3d">3D</NavLink>
      </div>
      <Outlet />
    </div>
  );
}

export default Layout
