var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://UsernameToken:MdpUsername@broker.shiftr.io')
var path= require('path')

//CONNEXION AU MQTT (Lire la température qui vient de l'arduino)
client.on('connect', function () {
    client.subscribe('temp')
    console.log("connected MQTT")
})

//Serveur qui écoute sur le port 8080
http.listen(8080, function(){
    console.log('listening on :8080')
})

app.get('/temp', function (req, res) {
    res.render('./temp.ejs');
    client.on('message',function(topic, message, packet){
        io.emit('temperature', message.toString())
    });
   
  })

//Page404 
app.use(function(req, res, next){
    res.status(404).send('Page introuvable !')
 });


 