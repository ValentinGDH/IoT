var express = require('express')
var app = express()
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://UsernameToken:MdpUsername@broker.shiftr.io')
 
    client.on('connect', function () {
        client.subscribe('temp')
        console.log("connected")
    })

    app.get('/', function(req, res) {

        res.setHeader('Content-Type', 'text/plain')
 
        res.send('Vous êtes à l\'accueil')
    });

    app.get('/light', function(req, res) {

        res.setHeader('Content-Type', 'text/plain')
 
        res.send('Entrez un paramètre dans l\'URL : /on ou / off')
    });
//PAGE POUR ALLUMER LA LAMPE    
    app.get('/light/:status', function(req, res) {

        res.setHeader('Content-Type', 'text/plain')
        if(req.params.status.toString()== "on"){
            client.publish('light', 'on')
        }else if(req.params.status.toString()== "off"){
            client.publish('light', 'off')
        }
        res.render('./light.ejs', {status: req.params.status});
     
     });
//PAGE 404
    app.use(function(req, res, next){

        res.setHeader('Content-Type', 'text/plain')
     
        res.status(404).send('Page introuvable !')
     
     });

app.listen(8080);
    