/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../../firebase";
import { logOut } from "../../pages/auth/redux/user.slice";
import { RootState, useAppDispatch } from "../../redux/store";
import links from "../../helpers/links";
import { Button, Dropdown } from "antd";
import { useSelector } from "react-redux";

export default function NavLinks() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  console.log("user:", user);

  // Sủ dụng điều kiện để render navigate

  const logout = () => {
    auth.signOut();
    dispatch(logOut(null));
    navigate("/login");
  };

  const handleChangeLayout = () => {
    navigate("/admin/dashboard");
  };

  const items = [
    {
      key: "2",
      label:
        user && user.token ? (
          <div onClick={handleChangeLayout}>Dashboard</div>
        ) : null,
    },
    {
      key: "3",
      label: <div onClick={logout}>Logout</div>,
    },
  ];

  return (
    <MainNav className="main-nav">
      <ul className="main-nav-list">
        {links.map((link) => {
          const { text, path } = link;

          return (
            <li className="list-item" key={text}>
              <NavLink to={path} key={text} className="main-nav-link" end>
                {text}
              </NavLink>
            </li>
          );
        })}

        {user ? (
          <>
            {" "}
            <li className="list-item">
              <Dropdown menu={{ items }} placement="bottomLeft">
                <Button>{user?.name}</Button>
              </Dropdown>
            </li>
          </>
        ) : (
          <>
            <li className="list-item" key={"Login"}>
              <NavLink
                to={"/login"}
                key={"Login"}
                className="main-nav-link"
                end
              >
                Login
              </NavLink>
            </li>

            <li className="list-item" key={"Register"}>
              <NavLink
                to={"/register"}
                key={"Register"}
                className="main-nav-link"
                end
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </MainNav>
  );
}

const MainNav = styled.nav`
  .main-nav-list {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 3.2rem;
  }

  .main-nav-link {
    text-decoration: none;
    color: #7d879c;
    &:hover {
      color: #d23f57;
    }
    &:active {
      color: #d23f57;
    }
  }
`;
