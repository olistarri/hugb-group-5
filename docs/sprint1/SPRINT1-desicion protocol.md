# First group meeting - 23 August 2022
## Discord server
First we created a Discord server, so that we could communicate more easily.
## Gitlab
We created a Gitlab repository and forked the template repo for this course.
## Brainstorm
We did a brainstorm session during our first lab session. 
The initial ideas for the project were:
* Hairdressing salon / barber shop
* Car mechanic
* Psycologist office
* Escape room
* Car detailing
* Phone repair shop

In the end we decided to pursue the barber shop idea, and to create a system for booking appointments at a barber shop.

# Second group meeting - 30 August
Our decicion protocol is that we brainstorm ideas and vote, the scrum master gets 1.5 votes to handle tied votes.
We used a random number generator to decide on the first scrum master.
Kári Georgsson is the current scrum master.

As we mentioned in the last meeting, the system is for a hypothetical barbershop.
We had a discussion about what kind of barber shop the system is for and the conclusion was that the system
is for a gentlemans barbershop.
A couple of other points came up, a more detailed description of what the system should be able to to, such as:
* The system consists of several subsystems: booking system, searching system, payment system and a main page to navigate the other subsystems.

These base requirements came from a discussuion of what we would like the system to be able to do if we were to book an appointment.
Some other desicions related to these were:  
* All subsystems consist of a frontend and backend except for the payments system, whose backend is out of this project’s scope.  
Since we don't think we have time to implement a full payment system, the frontend will handle payments, however the backend will not do anything to payment info
and all payments will be assumed to work.  
Since all of us have finished the Web Programming class we decided to make the frontend in React and backend in Nodejs.  
* System will be implemented using React and NodeJS  
Sindri has used React before and convinced us that it would be a good candidate for this project.  
All of us have used Nodejs before so it was chosen as the backend runtime environment.  
We will all look into React and Sindri will give us tips and tricks to use React.  
* System will be written in TypeScript  
TypeScript is very similar to JavaScript, but gives us a more robust system since it increses type security.  
* The database will be non-relational and implemented using MongoDB  
We decided to use MongoDB since it handles the database as JSON, which makes it very easy to store data using TypeScript (and JavaScript) since it is the native way TypeScript handles files. It is also more dynamic than traditional relational databases.
