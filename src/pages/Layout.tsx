import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <table>
          <tr>
            <td className="links"><Link to="/">Home</Link></td>
            <td className="links"><Link to="/helloworld">HelloWorld</Link></td>
          </tr>
        </table>
      </nav>
      <Outlet/>
    </>
  );
};

export default Layout;
