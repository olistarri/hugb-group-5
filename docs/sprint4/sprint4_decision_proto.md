# 4/10/22 First group meeting in sprint 4

Sindri var valinn scrum master í þessum spretti.

Markmið þessa spretts er að:

Bætt við flag á alla appointments svo þeir geti verið skráðir canceled í stað þess að eyða þeim.

Barber getur skráð daga sem hann mætir ekki í vinnuna
Allir appointments á þeim dögum flaggaðir
Flaggaðir appointments eru merktir í UI

Ekki hægt að skrá tíma á barber sem er skráður í frí

Holiday endpoint, barber ákveður "frídag"

Notification á nav bar.

Notification end point á bakenda sem sendir öll notifications fyrir ákveðinn user.

Einnig í yfirliti yfir alla tíma bókaða verður rautt merki yfir þeim tímum sem hefur verið hætt við af “barber”, minnir að þar er hægt að ýta áfram til að finna nýjan tíma ef tími manns var hættur við og skráum þar svo aðrir barbers geti séð tíma sem hefur verið hætt við

Barber getur rescheduelað tíma í Dashboard án þess að user sé notified (Ætlast til að barber geri það með viðskiptavininum)

Barber getur cancelað tíma, þá fær notandinn valmöguleikann á að reschedulea tímann eða cancela honum.

Bókun á að virka svona:
Velja fyrst barber, svo service þar sem barberar geta átt mismunandi services, og mismunandi verð. 

Verkefniskipting er eftirfarandi:

- UI: Andri and Kári
- Backend: Sindri and Ólafur
- Tests: Ragnar and Arnar


# 14/10/2022 Work day
Sindri started by adding rescheduleing functionality to the backend. This included making a PATCH endpoint for appointments, which would serve as a way to cancel and reschedule appointments.
We then worked on the UI, changing the JS code to use the PATCH endpoint instead of the DELETE one.

We then setup a notificaiton system which would show users notifications about cancelled appointments that needed to be rescheduled.


# 15/10/2022 
We added an endpoint and a database to keep track of barber holidays.

We then implemented a backend check which doesn't allow bookings on those days.

If a booking already exists on holidays, they will be marked for rescheduling.

# 16/10/2022 Third group meeting in sprint 4
We made some UI changes to history and the Barber Dashboard to accomodate the rescheduling of appointments and their cancellation.

We also added a flag to each appointment that had been cancelled to allow users to see it more clearly.

After all that we did a code review and implemented changes in response.

We decided to leave one code review problem unsolved, and we will tackle it as an issue next sprint.

