const express = require('express');
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostaId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostaId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req,res) => {
    const commID = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = commentsByPostaId[req.params.id] || [];

    comments.push({id:commID, content, status: 'pending'});

    commentsByPostaId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events',{type:'CommentCreated', data:{id:commID, content, postId: req.params.id, status: 'pending'}});

    res.status(201).send(comments);
})

app.post('/events', async (req,res) => {
    console.log('received event', req.body.type);

    const {type, data} = req.body;

    if (type == "CommentModerated") {
        const {postId, id, status, content} = data;

        const comments = commentsByPostaId[postId];

        const comment = comments.find(comment => comment.id === id);

        comment.status = status;

        await axios.post('http://localhost:4005/events', {type: "CommentUpdated", data: {
            id,
            status,
            postId,
            content
        }})
    }

    res.send({});
})


app.listen(4001, () => {
    console.log(`On 4001`)
})
