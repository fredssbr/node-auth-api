const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const mySecret = process.env.mySecret || 'keepuppayattentionandbehappy';

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, mySecret, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });

    
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Sagarmatha, the mountain',
        email: 'sagarmathanationalpark@sagarmatha.com'
    };

    jwt.sign({user}, mySecret, { expiresIn: '30s'}, (err, token) => {
        res.json({token});
    });

});
/* 
    FORMAT OF TOKEN
        Authorization: Bearer <access_token>
*/
// Verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(bearerHeader) {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(port, () => console.log(`Server started on port ${port}`));