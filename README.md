#Expenses Manager

##Apis for 
  1. Users
  2. expenses

##User Routes:-
  1. Signup - along with password hashing 
  2. signin
  3. logout
     
##Expenses Routes :
  1. create Expenses
  2. get all expenses of user
  3. get expenses by id
  4. get expenses by category
  5. get expenses between 2 dates
  6. update expenses
  7. delete expenses

##DataBase Schema : 
###User : 
  1. userId - PK
  2. email
  3. password
###Expenses
  1. id -  PK
  2. userId - reference of userd table
  3. categoryId - reference of category table
  4. expenseAmount
  5.  expenseDescription
  6.  Date
###Total Expenses
  1. id : PK
  2. userId : references Expenses table
  3. totalExpenses

##Relations
  1. User - Expenses : One To Many
  2. category - Expenses : One To Many
  3. TotalExpense - Expenses : One To Many

##Middlewares
  1. auth :- Checks user is loggend in or not
note :- Implemented session based Authentication using  express-mysql-session
    
##Major liabraries/modules used : 
  1. express
  2. bcrypt :- password encryption
  3. sequalize :- Object Realtion Mapping (ORM) with mysql DB
  4. express session
  5. express mysql session :- session based Authentication 
  for more refer package.json file

##Dabatabase : MySql


