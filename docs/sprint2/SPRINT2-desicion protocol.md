# 06/07/2022 First group meeting in sprint 2
We started by randomly selecting the scrum master. Andri was selected.

We started by reviewing the user stories, adding four additional that we felt like were needed and then choosing 20, 17, 19, 15, 9, 7, 6 to attempt to implement during this sprint.
20: Create an account.
17: Book an appointment.
19: See different services available.
15: See all my previous bookings.
9: See price of the haircut.
7: Pick a specific barber.
6: Cancel an appointment.

Next we made implementable tasks from these user stories. The tasks are stored under issues -> boards -> sprint 2 backlog.

Next we made the definition of done. It is stored under issues -> tasks (which are the definition of done that we have to finish).

#08/09/2022 Finishing the definition of done.
We had a short Discord meeting about the definition of done, went over it and the scrum master turned it in for further feedback.

#13/09/2022 Second group meeting in sprint 2
We started by going over the teacher's feedback. The feedback identified two problems: We had forgotten to split up some user stories and we forgot to "assign" ourselves to those tasks.

We discussed amongst ourselves the general task assignment. We decided to split the group into 3 "working groups": Sindri and Ólafur will be mostly working on the core and back-end, Kári and Andri will mostly be working on front-end, Arnar Þór and Ragnar will be mostly focusing on the testing.

With this general task assignment in mind each member assigned tasks on themselves.

Since there is a lot to do in this sprint we decided to hold off on using React. React's primary use for us is scalability and it isn't really a big factor in this sprint.


#15/09/2022 Work session
Around 16:00 pm we met to work on the project. Sindri, Ólafur, Arnar and Ragnar met at school while Andri and Kári joined on Discord. Sindri and Ólafur had already made part of the base code, including two endpoints before this meeting. At the start of the meeting we had a short discussion about what we where going to do today, we basically decided that everone should keep working on their own assigned tasks.
Andri and Kári made the initial look for register.html, login.html, index.html, select_servie.html, select_barber.html and select_time.html. The pages are not currently functional with the backend.
Sindri and Ólafur worked on...
Arnar and Ragnar worked on...

#17/09/2022 Work session
Sindri and Ólafur finished all endpoints, the general segments are that customers can now register, log in, get all available appointments, get their previous appointsments and book a new appointment. In addition to this they fixed multiple bugs and joined the frontend to the backend.
Today we kept working in our indiviudal groups but at the end started to merge them together.
Andri and Kári kept working on the frontend. Made an additional page called booking_confirmed.html and finished the navigation between pages. Now the user can go trough the booking process and have all their actions logged. Sindri later connected the results to the endpoint.
Arnar and Ragnar kept working on the endpoint test, they aim to finish them tomorrow.


#15 - 18/09/22 Endpoint Tests
We (Arnar and Ragnar) had been working on the endpoint tests. We divided the tasks between us on gitlab and worked indpendently in two seperate files, to prevent merge conflicts. Then when the majority of tests were ready, we merged the two files into one, making it easier to review. The other members helped us when we got stuck on some tests so it was good teamwork all around. 
