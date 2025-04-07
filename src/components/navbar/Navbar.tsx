import styled, { css } from "styled-components";
import NavLinks from "./NavLinks";
import logo from "./../../../public/img/logos/logo2.svg";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
const headerHeight = 72;

export default function Navbar() {
  const [isFixed, setFixed] = useState(false);

  const scrollListener = useCallback(
    debounce(() => {
      if (window?.pageYOffset >= headerHeight) setFixed(true);
      else setFixed(false);
    }, 50),
    []
  );
  useEffect(() => {
    if (!window) return;
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <WrapperHeader className="header" isFixed={isFixed}>
      <a href="#">
        <img className="logo" alt="Omnifood logo" src={logo} width={100} />
      </a>

      <NavLinks />
    </WrapperHeader>
  );
}

const WrapperHeader = styled.header<{ isFixed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f5f9;
  min-height: 7.6rem;
  padding: 0 4.8rem;

  ${(props) =>
    props.isFixed &&
    css`
      position: "fixed";
    `}
`;
