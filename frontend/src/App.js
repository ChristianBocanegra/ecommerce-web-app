/* 
  File Name: App.js
  Description: This file sets up the main routing and structure for the React application. 
               It includes routes for various pages such as home, user authentication, 
               ads management, user account, and private routes requiring login.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

// Import necessary modules for routing and layout components
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Home from "./components/home";
import MyAds from "./components/ads/listAds";
import NotFound from "./components/layout/notFound";
import SignIn from "./components/auth/signIn";
import Register from "./components/auth/signUp";
import ListUsers from "./components/users/listUsers";
import MyAccount from "./components/accounts/account";
import MyQuestions from "./components/questions/listMyQuestions";
import EditAccount from './components/accounts/editAccount';
import DetailsAd from "./components/ads/detailsAd";
import DetailsHomeAd from "./components/ads/detailsHomeAd";
import CreateAd from "./components/ads/createAd";
import EditAd from "./components/ads/editAd";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreateQuestion from "./components/questions/createQuestion";
import EditQuestion from "./components/questions/specificQuestion";
import "./index.css";

// Main App component defining the structure and routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="Technology" element={<Home/>} />
          <Route path="Home & Kitchen" element={<Home />} />
          <Route path="Videogames" element={<Home />} />
          <Route path="Musical Instruments" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="MyUser/Ads" element={
            <PrivateRoute>
            <MyAds/>
            </PrivateRoute>} />
          <Route path="/Ads/Details/:id" element={<DetailsAd />} />
          <Route path="/Home/Ads/Details/:id" element={<DetailsHomeAd />} />
          <Route path="MyUser/ListUsers" element={
            <PrivateRoute>
                <ListUsers/>
            </PrivateRoute>} />
          <Route path="MyUser/MyAccount" element={
            <PrivateRoute>
                <MyAccount/>
            </PrivateRoute>} />  
          <Route path="/MyUser/MyQuestions/" element={
            <PrivateRoute>
                <MyQuestions/>
            </PrivateRoute>} />
          <Route path="Register" element={<Register />} />
          <Route path="Myuser/MyAccount/Edit" element={<EditAccount />} />         
          <Route path="Ads/Create" element={<CreateAd />} />
          <Route path="/Ads/Edit/:id" element={<EditAd />} />
          <Route path="/questions/create/:adID" element={<CreateQuestion />} />
          <Route path="questions/Answer/:questionID" element={<EditQuestion />} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

// Export the App component to be used in other parts of the application
export default App;
