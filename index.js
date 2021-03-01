const express = require('express');
const app = express();


// https://alfaaz-chat.herokuapp.com/


//adding Socket-io to the project
const socket = require('socket.io');
const port = process.env.PORT || 8000;
 //creating server for running node app and socket-io
const server = app.listen(port,()=>{
  console.log("server connected....");
});

app.use(express.static('public'));

//Connecting to the server - Node server which will handle socket io connection
const io = socket(server);

//Default route
app.get("/", (req,res)=>{
  res.render("index.html");
});

//Store users as they join and leave
const users={}

//Establish the connection from backend(Server) for the frontend
io.on('connection', (socket)=>{
  //console.log("connected ");

  //New user joined, collect user's name and store it corresponding to socket.id assigned to the user in users object
  socket.on('new-user-joined', name=>{
    users[socket.id] = name;
    //console.log("New user", name);
    socket.broadcast.emit('user-joined', name); //broadcast everyone else about the new joined user
  });

  //Send message to everyone except the sender (doing it in frontend itself for sender)
  socket.on('send', message=>{
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
  });

	// Handle typing event
    socket.on('typing', (name) => {
        socket.broadcast.emit('typing', name);
    });

    // Handle disconnect event, whenever someone leaves the chat notify others
    //disconnect is a keyword and it can not be replaced by any other name as it is fired by server itself
    socket.on('disconnect',message=>{
      socket.broadcast.emit('left',users[socket.id]);
      delete users[socket.id];
    });
});
