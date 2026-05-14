/* 
  File Name: PrivateRoute.js
  Description: This component is used to protect routes from unauthorized access. 
               If the user is not authenticated, they are redirected to the sign-in page.
               If the user is authenticated, the requested children component is rendered.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Importing necessary hooks and authentication helper functions
import { useLocation, Navigate   } from 'react-router-dom'
import { isAuthenticated } from './auth-helper'

// PrivateRoute Component - A wrapper for protected routes
function PrivateRoute({ children }){

     // Get the current location of the user
    let location = useLocation();

     // If the user is not authenticated, redirect them to the signin page
    if(!isAuthenticated()){
        return <Navigate to="/signin" state={{ from: location.pathname}} />
    }

    // If authenticated, render the children components (protected content)
    return children
}

// Exporting the PrivateRoute component
export default PrivateRoute;