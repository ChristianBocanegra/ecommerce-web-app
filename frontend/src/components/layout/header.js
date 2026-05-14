/* 
  File Name: Header.js
  Description: This component defines the header section of the web application. It includes navigation links and user-related actions like 
               login/logout. It displays different content based on whether the user is authenticated and whether they are an admin.
               The component also handles the user's session and navigation.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

// Imports necessary components and functions for the Header component
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../../assets/logo.jpg';
import UserLogo from '../../assets/user-login.png';
import { logOut } from '../../datasource/API-user';
import './header.css';
import { isAuthenticated, clearJWT } from '../auth/auth-helper';

// Header functional component
function Header(){
    const [isAdmin, setIsAdmin] = useState(false);
    const Authenticated = isAuthenticated();
    const userName = sessionStorage.getItem('username');
    // Effect hook to load the admin status from sessionStorage when authentication changes
    useEffect(() => {
      const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    }, [Authenticated]); // Run this whenever Authenticated changes
    
    const { state } = useLocation();
    const { origen } = state || { origen: { pathname: '/' } };
    const [errorMsg, setErrorMsg] = useState('')
    let navigate = useNavigate();

    // Define the logout handler
    const handleLogout = () => {
      const idUser = sessionStorage.getItem('idUser');
      logOut(idUser).then((response) => {
          if (response && response.success) {
            // Clear the session storage
             sessionStorage.clear();
             navigate(origen, { replace: true });
          } else {
            setErrorMsg(response.message);
          }
      }).catch((err) => {
        setErrorMsg(err.message);
      });
      clearJWT(); // Clear the JWT token from local storage
   };

    return(
        <>
            <center>
              <Link to="/">
                <img className='logo' src={logo} alt="Logo image" />
              </Link> 
            </center> 
            <nav class="navbar">
                <ul class="nav-list">
                    <li><NavLink to="/">All</NavLink></li>
                    <li><NavLink to="/Technology">Technology</NavLink></li>
                    <li><NavLink to="/Home & Kitchen">Home & Kitchen</NavLink></li>
                    <li><NavLink to="/Videogames">Videogames</NavLink></li>
                    <li><NavLink to="/Musical Instruments">Musical instruments</NavLink></li>
                    <li class="vert-navbar">
                            {!Authenticated &&
                            <div class="user-container">
                            <img class="UserLogo" src={UserLogo} alt="User logo" />
                            User
                        </div>}
                            {Authenticated &&
                            <div class="user-container">
                            <img class="UserLogo" src={UserLogo} alt="User logo" />
                            {userName}
                        </div>}                            
                        <ul class="dropdown">
                            {!Authenticated && <li><NavLink to="/SignIn">Sign In</NavLink></li>}
                            {Authenticated && <li onClick={handleLogout}><NavLink to="/">Log out</NavLink></li>}
                            {!Authenticated && <li><NavLink to="/Register">Register</NavLink></li>}
                            <li><NavLink to="/MyUser/Ads">{isAdmin ? "Ads History" : "My Ads"}</NavLink></li>
                            <li><NavLink to="/MyUser/MyQuestions">{isAdmin ? "Questions History" : "My Questions"}</NavLink></li>
                            {isAdmin && <li><NavLink to="/MyUser/ListUsers">List users</NavLink></li>}
                            <li><NavLink to="/MyUser/MyAccount">My Account</NavLink></li>
                        </ul>
                    </li>
                </ul>
            </nav>
          <Outlet />
        </>

    );
}

// Export the Header component for use in other parts of the application
export default Header;