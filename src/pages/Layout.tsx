import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <table>
          <tr>
            <td className="links"><Link to="/">Bus Postcode</Link></td>
            <td className="links"><Link to="/metro">Metro Postcode</Link></td>
            <td className="links"><Link to="/busmap">Bus Map</Link></td>
            <td className="links"><Link to="/metromap">Metro Map</Link></td>
          </tr>
        </table>
      </nav>
      <Outlet/>
    </>
  );
};

export default Layout;
