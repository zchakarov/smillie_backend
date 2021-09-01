const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const cors = require('cors');

const posts = require('./routes/posts');
const users = require('./routes/users');

app.use(express.json());
app.use(cors());




app.use('/api/posts', posts );
app.use('/api/users', users );

app.listen(3001, () => {
    console.log('Listening to 4001');
});
