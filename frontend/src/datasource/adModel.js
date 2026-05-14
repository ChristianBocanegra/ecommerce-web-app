/* 
  File Name: adModel.js
  Description: This file defines the adModel class, which represents an advertisement entity with various properties 
               such as title, description, category, owner, and more. The class includes a constructor to initialize 
               these properties and is designed for use in a broader application context.
  Team's name: BOFC 
  Group number: 04
  Date: November 23, 2024
*/

// Define a class named adModel to represent an advertisement model
class adModel {

     // Constructor to initialize the properties of the adModel instance
    constructor(title, description, category, owner, userName, price, status, startDate, endDate, message, created, updated, collection) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.owner = owner;
        this.userName = userName;
        this.price = price;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.message = message;
        this.created = created;
        this.updated = updated;
        this.collection = collection;
    }
}

// Export the adModel class to allow its use in other files
export default adModel;

