import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default Layout; 