# 4/10/22 First group meeting in sprint 4
Bætt við flag á alla appointments svo þeir geti verið skráðir canceled í stað þess að eyða þeim.

Barber getur skráð daga sem hann mætir ekki í vinnuna
Allir appointments á þeim dögum flaggaðir
Flaggaðir appointments eru merktir í UI

Ekki hægt að skrá tíma á barber sem er skráður í frí

Endpoint að þessi dagur er þessi barber ekki við svo þeir tímar eru ekki í boði

Notification á nav bar
Notification end point á bakenda sem sendir öll notifications fyrir ákveðinn user.

Einnig í yfirliti yfir alla tíma bókaða verður rautt merki yfir þeim tímum sem hefur verið hætt við af “barber”, minnir að þar er hægt að ýta áfram til að finna nýjan tíma ef tími manns var hættur við og skráum þar svo aðrir barbers geti séð tíma sem hefur verið hætt við

Barber getur rescheduelað tíma í Dashboard án þess að user sé notified (Ætlast til að barber geri það með viðskiptavininum)

Barber getur cancelað tíma, þá fær notandinn valmöguleikann á að reschedulea tímann eða cancela honum.

