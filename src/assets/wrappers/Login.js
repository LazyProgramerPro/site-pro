import styled from "styled-components";

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  width: 90vw;
  max-width: 30rem;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 576px) {
    width: 95vw;
    padding: 0.5rem;
  }
`;

export default Wrapper;