// import the express package 
const express = require('express');
const app = express();

// start the server on port 3000
const server = app.listen(3000, function() { 
    console.log('http://localhost:3000') 
})

// tell the server to use this subfolder to serve web pages
app.use(express.static('public'));
app.use(require('cors')())

// import the socket package too
const socket = require('socket.io')

// create the socket manager
const io = socket(server)

const testFolder = './public/client/_private/debuglogs/';
const fs = require('fs');
let debugfiles = new Array(); 

let files = fs.readdirSync(testFolder);

files.forEach(file => {
    debugfiles.push(file);
    console.log(file);
});

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    debugfiles.push(file);
    //console.log("file:")
    //console.log(file);
  });
});

console.log(debugfiles);
// handle event
io.sockets.on('connection', function (socket) {

    //socket.broadcast.emit('files', debugfiles);

    console.log(`connect ${socket.id}`)

    socket.broadcast.emit('files', debugfiles);

})