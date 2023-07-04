import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <table>
          <tr>
            <td><Link to="/">Home</Link></td>
            <td><Link to="/helloworld">HelloWorld</Link></td>
          </tr>
        </table>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
