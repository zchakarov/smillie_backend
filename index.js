const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send('test');
})

const db = mysql.createConnection(
    {
        user: "zlatin",
        host: "localhost",
        password: "Kriseto090888",
        database: "test",
    }
);

db.connect(function (error) {
    if(error) throw error
    else console.log("connected to the database")
});

const userMiddleware = require('./middleware/users');


app.post("/api/register", userMiddleware.validateRegister, (req, res, next) => {

    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
            req.body.username
        )});`,
        (err, result) => {
            if (result.length) {

                return res.status(409).send({
                    msg: 'This username is already in use!'
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        // has hashed pw => add to database
                        db.query(
                            `INSERT INTO users (username, email, password) VALUES (${db.escape(
                                req.body.username
                            )},${db.escape(
                                req.body.email
                            )}, ${db.escape(hash)})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: 'Registered!'
                                });
                            }
                        );
                    }
                });
            }
        }
    );

});

app.post('/api/createpost', (req, res, next) => {
    db.query("INSERT INTO posts (title, text) VALUES (?,?,?)",
        [req.body.author_id, req.body.title, req.body.text],
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send({
                msg: 'Post created',
            });
        }

        )

});

app.get('/api/posts-list', (req, res, next) => {
    db.query("SELECT * FROM posts;",
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            console.log(result);

            return res.status(200).send({
                msg: 'Posts List',
                list: result,
            });
        }

        )

});

app.post('/api/login', (req, res, next) => {
    db.query(
        "SELECT * FROM users WHERE username = ?;",
        req.body.username,
        (err, result) => {
            // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            if (!result.length) {
                return res.status(401).send({
                    msg: 'Username  is incorrect!'
                });
            }
            // check password
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    // wrong password
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg: 'Username or password is incorrect!'
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({
                                username: result[0].username,
                                userId: result[0].id
                            },
                            '12345678912345678901234567890', {
                                expiresIn: '7d'
                            }
                        );
                        res.header('auth_token', token);
                        db.query(
                            `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                        );
                        return res.status(200).send({
                            msg: 'Logged in!',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect!'
                    });
                }
            );
        }
    );
});

app.get('/ueber-mich', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
});

app.get("/", (req, res) => {
    res.send('hello world');
});





app.listen(3001, () => {
    console.log('Listening to 4001');
});
