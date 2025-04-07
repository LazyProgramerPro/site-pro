import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { container } from "../../styled/Container";
import { Spin } from "antd";

export default function RedirectURL() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    //RedirectURL count==0

    count === 0 && navigate("/");

    //clean up

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  return (
    <WrapperRedirectURL>
      <SpinStyled></SpinStyled>Redirect you in {count} seconds
    </WrapperRedirectURL>
  );
}

const WrapperRedirectURL = styled.div`
  ${container}
  margin-top: 5.2rem;
  max-width: 60rem;
`;
const SpinStyled = styled(Spin)`
  margin-right: 1rem;
`;
