const express = require('express');

const bodyParser = require('body-parser');

const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://localhost:4000/events', event).catch(err => {console.log(err)}); //Posts
    axios.post('http://localhost:4001/events', event).catch(err => {console.log(err)}); // Comments
    axios.post('http://localhost:4002/events', event).catch(err => {console.log(err)}); // query
    axios.post('http://localhost:4003/events', event).catch(err => {console.log(err)}); // moderation

    res.send({status: 'Ok'});
})

app.get('/events' , (req,res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log('Event bus 4005');
})