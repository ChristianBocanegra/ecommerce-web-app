/*
  File Name: footer.js
  Description: This React component renders a footer section for the webpage. It includes 
               a copyright notice and is styled with CSS classes for alignment and appearance.
               The component uses `<br>` tags for spacing and a horizontal rule (`<hr>`) 
               for visual separation.
  Team's Name: BOFC
  Group Number: 04
  Date: November 23, 2024
*/

function footer(){
    return (<>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <footer>
            <hr />
            <p className="text-muted text-center">&copy;&nbsp;Copyright Christian Bocanegra, Orlando Velasco, Brandy Larissa, and Fabian Bolanos - Final group project - COMP229 Web Application Development, third semester</p>
        </footer>
    </>
    );
}

// Exporting the footer component as the default export, so it can be imported and used in other parts of the application
export default footer;