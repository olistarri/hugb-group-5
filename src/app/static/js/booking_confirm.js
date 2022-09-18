var service = JSON.parse(sessionStorage.service);
var barber = sessionStorage.barbername;
var time = JSON.parse(sessionStorage.time);
console.log(time)
//////////////////////////////// Sorry er orðinn þreyttur laga seinna
 //Date
 var tag = document.createElement("p");
 var text = document.createTextNode(` Date: ${time[0]}`);
 tag.appendChild(text);
 var element = document.getElementById('details');
 element.appendChild(tag);
 //Time
var tag = document.createElement("p");
var text = document.createTextNode(` Time: ${time[1]}`);
tag.appendChild(text);
var element = document.getElementById('details');   
element.appendChild(tag);

// Barber
var tag = document.createElement("p");
var text = document.createTextNode(` Barber: ${barber}`);
tag.appendChild(text);
var element = document.getElementById('details');
element.appendChild(tag);

// service
var tag = document.createElement("p");
var text = document.createTextNode(` Service: ${service[0]}`);
tag.appendChild(text);
var element = document.getElementById('details');
element.appendChild(tag);

// price
var tag = document.createElement("p");
// Format 1000 to 1.000 
var price = service[1].toString();
var price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
var text = document.createTextNode(` Price: ${price} kr`);
tag.appendChild(text);
var element = document.getElementById('details');
element.appendChild(tag);
