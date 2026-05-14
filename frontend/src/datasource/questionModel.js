/* 
  File Name: questionModel.js
  Description: This file defines the questionModel class, which represents a question entity associated with advertisements. 
               It includes properties such as the question details, user contact information, related advertisement IDs, 
               and timestamps for creation and answering. The class includes a constructor to initialize these properties 
               and is designed to support question-related functionalities.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Define a class named questionModel to represent a question associated with an advertisement
class questionModel {

     // Constructor to initialize the properties of the questionModel instance
    constructor(firstName, lastName, question, email, phoneNumber, answer, createdDate, answerDate, adID, ownerAdID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.question = question;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.answer = answer;
        this.createdDate = createdDate;
        this.answerDate = answerDate;
        this.adID = adID;
        this.ownerAdID = ownerAdID;
    }
}

// Export the questionModel class to allow its use in other files
export default questionModel;

