//Ask the new user, his/her name
const name = prompt("Enter your name to join");

//Establish connections between frontend and backend using the CDN in the main html file
//Do it after the promt alert activities
//"https://alfaaz-chat.herokuapp.com/"
//"http://localhost:8000/"
const socket = io.connect("https://alfaaz-chat.herokuapp.com/"); //connected it to the backend

//Collecting all the elements needed to display and receive messages
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const feedback = document.getElementById('feedback');
var audio = new Audio('ding.mp3'); //audio for the messages


//Function to add the messages to the container
const append = (message,position,sound) =>{
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement); //adding the new message to the container
  if(sound == 1){
     audio.play(); //play message
  }
}

//take the input message and send to it to all the other recivers and add it to the frontend for all
// add the message to the senders screen as well (cause we are broadcasting the message not emiting it)
form.addEventListener('submit', (e)=>{
  e.preventDefault(); //page doesn't reloads
  const message = messageInp.value;
  if(message === ""){
    return;
  }
  append(`You: ${message}`,'right',0);
  socket.emit('send',message);
  messageInp.value = '';
});

//Listen to keypress element and notify other that someone is typing
messageInp.addEventListener('keypress', function(){
  //  console('typing');
    socket.emit('typing',name);
})

//whenever someone joins, call the new-user-joined with passing the user's name
socket.emit('new-user-joined', name);

//Notify all about the new user by adding a message to the char
socket.on('user-joined', name =>{
  append(`${name} joined the chat`, 'right',1);
});

//Send message to the screen of all the recivers
socket.on('receive', data =>{
  append(`${data.name}: ${data.message} `, 'left',1);
   feedback.innerHTML='<p><em>Status...</em></p>';
});

//Adding the name of the person who's currently typing
socket.on('typing', name => {
    feedback.innerHTML = '<p><em>' + name + ' is typing a message...</em></p>';
  //  appends(`${p}`,'left');
});

//Notify others who left the chat
socket.on('left', name =>{
  append(`${name} has left the chat`,'right',1);
});

//things left - image, scroll below
