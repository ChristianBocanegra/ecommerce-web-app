/* 
  File Name: userModel.js
  Description: This file defines the userModel class, which represents a user entity in the system. 
               It includes properties such as user personal information, authentication details, and timestamps 
               for account creation and updates. The class also supports user role differentiation, such as admin status.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Define a class named userModel to represent a user in the system
class userModel {

    // Constructor to initialize the properties of the userModel instance
    constructor(firstName, lastName, email, username, hashed_password, salt, created, updated, admin) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.hashed_password = hashed_password;
        this.salt = salt;
        this.created = created;
        this.updated = updated;
        this.admin = admin;
    }
}

// Export the userModel class to allow its use in other files
export default userModel;