/* 
  File Name: notFound.js
  Description: This component renders a "404 page not found" message when the user navigates to an invalid route. 
               It provides a message suggesting the user may be lost and offers a suggestion to go back to the previous page.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

// Defining the NotFound functional component
const NotFound = () => {     
    return (
        <>
            <center>
                <h1>404 page not found</h1>
                <h2>It is possible you are lost. Go back to the previous page.</h2>
            </center>
        </>
    );
};

// Exporting the NotFound component for use in other parts of the application
export default NotFound;
