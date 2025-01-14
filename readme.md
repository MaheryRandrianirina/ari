# ARI

## Description
Ari is a tasks management system kanban like. 

## Features
- Registration & Authentication system
- Admin can check new user
- Admin is able to see user tasks with their status
- Admin can create task and attach it to a specific user
- Admin is able to see task progress
- User can change task status (not done, in progress, done) by drag and dropping the task between boxes
- While in progress, user can mark his progress by downgrading or upgrading the jauge

## How to install ?
- Download NodeJs from [https://nodejs.org/en/download] then install it if you don't have it installed yet
- Download Mongodb Compass from [https://www.mongodb.com/products/tools/compass] then install it if you don't have it installed yet
- Clone the project into your local machine
- You can specify your database name in the .env.local file inside api/ directory by adding "/your_database_name" after "DATABASE=mongodb://localhost:27017"
- Run Mongodb Compass and connect to the database
- In the client/ directory, run the following command : npm run dev
- In the api/directory, run the following command : npm run start:dev
- You must manually define "admin" status of an user you've created directly in the "user" table of the database

## Enjoy