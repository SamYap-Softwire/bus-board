import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <table>
          <tr>
            <td className="links"><Link to="/">Bus</Link></td>
            <td className="links"><Link to="/metro">Metro</Link></td>
            <td className="links"><Link to="/map">Map</Link></td>
          </tr>
        </table>
      </nav>
      <Outlet/>
    </>
  );
};

export default Layout;
