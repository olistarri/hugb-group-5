# Barber Inc Booking System 

Barber Inc Booking System is a booking system for a barber shop, where clients can book their haircuts and shaves!

## Features
* A user can book their appointment.
* A user can see all of their previous appointments.
* A user can choose a barber, as well as their service and see the price of the haircut.
* A user can create an account, and log in.

# Installation
## NodeJs
First make sure you have Node.js installed. Downloads for windows and mac can be found at the [Node.js download page](https://nodejs.org/en/download/).

Instructions for linux based systems can be found [here](https://nodejs.org/en/download/package-manager/).
### Installing required packages
Clone this repository or download it.

Open a terminal and make sure that you are in the /src/app directory.

**To install all required packages:**
```bash
npm install
```
or
```bash
npm -i
```
**To run the server:**
```bash
npm start
```
The page will be accessible at http://localhost:3000

Please make sure that port 3000 is not in use by any other application.

You should be greeted by the following page:

![Main page](https://i.ibb.co/Dz17Dd9/barbershop.jpg)

Here you can log in after creating an account and book an appointment.
The code coverage report is also embedded into the website. 

# Testing
To run the the unit tests, run the following command in the terminal: 
```bash
npm test
```
The output shows the result of the tests.

To generate a new coverage report (should not be nessecary), in the terminal run:
```bash
npm run coverage
```
