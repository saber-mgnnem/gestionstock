import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserName(parsedUser.name);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  const showAlert = (message) => {
    alert(message);
  };

  return (
    <NavbarContainer>
      <ContainerFluid>
        <NavbarCollapse>
          <NavbarBrand href="#">
        
          </NavbarBrand>

          <SearchForm role="search">
            <SearchContainer>
              <SearchIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </SearchIcon>
              <SearchInput type="search" placeholder="Search" aria-label="Search" />
              <SearchButton type="submit">search</SearchButton>
            </SearchContainer>
          </SearchForm>

          <IconContainer>
            <Dropdown>
              <DropdownToggle className="navbar-icon">
                <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.4 5.4H4V6.6H13.2189C13.1612 6.78478 13.0895 6.99578 13.0025 7.22211C12.7032 8.00031 12.2402 8.91125 11.5757 9.57574L10 11.1515L9.42426 10.5757C8.72102 9.8725 8.25297 9.16987 7.96199 8.64611C7.81668 8.38455 7.71617 8.16874 7.65305 8.02146C7.62151 7.94787 7.59937 7.89154 7.5857 7.85534C7.57886 7.83725 7.57415 7.8242 7.57144 7.81657L7.56886 7.80922C7.56886 7.80922 7.56921 7.81026 7 8C6.43079 8.18974 6.43091 8.19009 6.43091 8.19009L6.43133 8.19135L6.43206 8.19351L6.4341 8.19948L6.44052 8.21786C6.44587 8.23292 6.45336 8.25357 6.46313 8.27942C6.48266 8.33112 6.5113 8.40369 6.55008 8.49416C6.62758 8.67501 6.74582 8.92795 6.91301 9.22889C7.24703 9.83013 7.77898 10.6275 8.57574 11.4243L9.15147 12L4.57964 16.5718L4.57655 16.5749L4.57577 16.5757L5.4243 17.4242L5.42688 17.4216L10.0368 12.8117L12.6159 14.9609L13.3841 14.0391L10.8888 11.9597L12.4243 10.4243C13.2598 9.58875 13.7968 8.49969 14.1225 7.65289C14.2818 7.23863 14.395 6.87072 14.4696 6.6H16V5.4H10.6V4H9.4V5.4ZM17.4405 10L21.553 19.7672H20.2509L19.1279 17.1H14.8721L13.7491 19.7672H12.447L16.5595 10H17.4405ZM15.3773 15.9H18.6227L17 12.0462L15.3773 15.9Z" fill="#121923"></path>
                </svg>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="#"><LangueFlag src="/images/France.jpg" alt="French" /> Français</DropdownItem>
                <DropdownItem href="#"><LangueFlag src="/images/Anglais.jpg" alt="English" /> Anglais</DropdownItem>
                <DropdownItem href="#"><LangueFlag src="/images/Arabe.png" alt="Arabic" /> Arabe</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownToggle className="navbar-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </DropdownToggle>
              <DropdownMenu>
                <ProfileItem><ProfileImage src="/images/DefaulteProfile.jpg" alt="Profile" /> {userName || 'Admin'}</ProfileItem>
                <DropdownItem href="#">Profile</DropdownItem>
                <DropdownItem href="#">Angalis</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <SimpleIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 9H17M7 13H17M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z" stroke="#000000" strokeWidth="1.488" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </SimpleIcon>

            <SimpleIcon as="a" href="/faq">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path> 
                <circle cx="12" cy="16" r="1" fill="#1C274C"></circle>
                <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
              </svg>
            </SimpleIcon>

            <SimpleIconButton onClick={logout}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12L13 12" stroke="#323232" strokeWidth="1.608" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9" stroke="#323232" strokeWidth="1.608" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19" stroke="#323232" strokeWidth="1.608" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </SimpleIconButton>
          </IconContainer>
        </NavbarCollapse>
      </ContainerFluid>
      <NavbarDivider />
    </NavbarContainer>
  );
};

// Styled Components
const NavbarContainer = styled.nav`
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  padding: 10px 0;
  max-height: 70px;
`;

const ContainerFluid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
`;

const NavbarBrand = styled.a`
  margin-left: 15px;
`;

const Logo = styled.img`
  height: 40px;
  width: 130px;
`;

const NavbarCollapse = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 15px;
  width: 530px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchIcon = styled.svg`
  position: absolute;
  margin-left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #0284c7;
  width: 20px;
  height: 20px;
`;

const SearchInput = styled.input`
  padding-left: 40px;
  padding-right: 10px;
  height: 38px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  flex-grow: 1;
`;

const SearchButton = styled.button`
  border: solid 1px #d7dae0;
  background:#0284c7;
  padding: 6px 12px;
  border-radius: 3px;
  color: #FFF;
  margin-left: 10px;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover ul {
    display: block;
  }
`;


const DropdownToggle = styled.button`
  all: unset;
  cursor: pointer;
  width: 36px;
  height: 36px;
  margin-left: 10px;
  transition: fill 0.3s, transform 0.3s, box-shadow 0.3s;
  background-color: rgba(249, 250, 251);
  border: 1px solid rgba(229, 231, 235);
  border-radius: 7px;
  padding: 0 4px 4px 4px;
  color:rgb(54, 107, 128);

  &:hover {
    box-shadow: 0 0 0.2rem #0284c7;
    transform: scale(1.1);
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  list-style: none;
`;


const DropdownItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const LangueFlag = styled.img`
  width: 30px;
  height: 20px;
  margin-right: 8px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const ProfileItem = styled(DropdownItem)`
  font-weight: bold;
`;

const SimpleIcon = styled.div`
  width: 36px;
  height: 36px;
  margin-left: 10px;
  cursor: pointer;
  transition: fill 0.3s, transform 0.3s, box-shadow 0.3s;
  background-color: rgba(249, 250, 251);
  border: 1px solid rgba(229, 231, 235);
  border-radius: 7px;
  padding: 5px;
  color:rgb(54, 111, 128);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 0.2rem #0284c7;
    transform: scale(1.1);
  }
`;

const SimpleIconButton = styled.button`
  all: unset;
  width: 36px;
  height: 36px;
  margin-left: 10px;
  cursor: pointer;
  transition: fill 0.3s, transform 0.3s, box-shadow 0.3s;
  background-color: rgba(249, 250, 251);
  border: 1px solid rgba(229, 231, 235);
  border-radius: 7px;
  padding: 5px;
  color: #rgb(54, 113, 128);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 0.2rem #0284c7;
    transform: scale(1.1);
  }
`;

const NavbarDivider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid #0284c7;
  margin-top: 10px;
`;

export default Navbar;