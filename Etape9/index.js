var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://UsernameToken:MdpUsername@broker.shiftr.io')


const express= require('express')

const app = express()

client.on('connect', function () {
  client.subscribe('temp')
  console.log("connected")
  client.publish('temp', '39°')
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})