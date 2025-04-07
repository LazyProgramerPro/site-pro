import { Outlet } from "react-router-dom";
import styled from "styled-components";

export default function PageContent() {
  return (
    <WrapperPageContent>
      <Outlet></Outlet>
    </WrapperPageContent>
  );
}

const WrapperPageContent = styled.div``;
