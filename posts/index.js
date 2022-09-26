const express = require('express');
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');
const { addAbortSignal } = require('stream');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const data = {};

app.get('/posts', (req, res) => {
    res.send(data);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');

    const  {title} = req.body;
    data[id] = {id, title};

    await axios.post('http://localhost:4005/events',{type:'PostCreated', data:{id, title}});

    res.status(201).send(data[id]);
});

app.post('/events', (req,res) => {
    console.log('received event', req.body.type);

    res.send({});
})

app.listen(4000, () => {});