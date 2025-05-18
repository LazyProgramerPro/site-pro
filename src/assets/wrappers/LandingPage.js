import styled from "styled-components";

const Wrapper = styled.section`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    font-size: 3rem;
    line-height: 1.2;
    letter-spacing: -0.5px;
    margin-bottom: 2rem;
    
    span {
      color: var(--primary-500);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        height: 6px;
        bottom: 5px;
        left: 0;
        right: 0;
        background: var(--primary-200);
        z-index: -1;
        border-radius: 10px;
        opacity: 0.6;
      }
    }
  }
  p {
    line-height: 1.8;
    font-size: 1.1rem;
    color: var(--text-secondary-color);
    margin-bottom: 2.5rem;
    max-width: 40em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
    transform: scale(1.05);
    transition: transform 0.5s ease;
    
    &:hover {
      transform: scale(1.08);
    }
  }  .btn {
    padding: 0.75rem 1rem;
  }
  
  .btn-hero {    font-size: 1.1rem;
    padding: 0.85rem 1.5rem;
    font-weight: 500;
    background: var(--primary-500);
    color: white;
    border-radius: 6px;
    box-shadow: var(--shadow-2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background: linear-gradient(90deg, #1677ff 0%, #0958d9 100%);
      transition: all 0.5s ease;
      z-index: -1;
    }
    
    &:hover {
      color: white;
      box-shadow: 0 7px 15px rgba(22, 119, 255, 0.35);
      transform: translateY(-3px);
      
      &::before {
        width: 100%;
      }
    }
      &:active {
      transform: translateY(-1px);
      background: #0958d9;
      
      &::before {
        background: linear-gradient(90deg, #0958d9 0%, #003eb3 100%);
      }
    }
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 4rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Wrapper;
