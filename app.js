'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const access_token = "EAAHtbv6e2RoBAIEWMqX7DZA0V8oXvGJSSTSRNQ1UFum21l7prNKe93HEt3AxXVmXxTX82DIRSi4r1OrZA7T9GZAfJWVdZCFAJaQD72OSixK1unqzF5iLvehXhbS9a5XSOGav3bUvb8pNv4VIrMW6KPzhRM5RF1N3r6RSsEczffqrabiKccQt6hlfTHbgWnNkHU3LSGxn2wZDZD"

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!')
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'evospeed_token'){
        response.send(req.query['hub.challenge'])
    } else {
        response.send('EvoSpeed no tienes permisos.')
    }
})

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleMessage(event);
        });
     }
     res.sendStatus(200);
});

function handleMessage(event){
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    }
    callSendApi(messageData);
}

function callSendApi(response) {
    request({
        "uri": "https:/graph.facebook.com/me/messages/",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err) {
        if(err) {
            console.log('Ha oocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    }
)
}

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})