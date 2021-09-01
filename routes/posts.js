const express = require('express');
const mysql = require('mysql');
const router = require('express').Router();
const cors = require('cors');
const app = express();

const config = require('./db');
const db = config.db;

router.post('/create', (req, res, next) => {
    db.query("INSERT INTO posts (title, text, createdAt) VALUES (?,?,?)",
        [req.body.title, req.body.text, req.body.date],
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

router.post('/edit/:id', (req, res, next) => {
    db.query("UPDATE posts SET title = ?, text = ? WHERE id=?",
        [req.body.title, req.body.text, req.params.id],
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

router.delete("/delete/:id", (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    console.log("id: ", req.params.id);
    console.log(sql);

    // delete a row with id = req.params.id
    db.query(sql, (error, results, fields) => {
        if (error) return console.error(error.message);
        res.status(200).send(results);
    });
});

router.get('/list', (req, res, next) => {
    db.query("SELECT * FROM posts;",
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send(result);
        }

    )

});

router.get('/singlepost/:id', (req, res, next) => {
    db.query("SELECT * FROM posts WHERE id= ?;",
        [req.params.id],
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send(result);
        }

    )
});

router.post('/likes', (req, res) => {
    db.query("INSERT INTO likes (user_id, post_id) VALUES (?,?)",
        [req.query.userId, req.query.postId],
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
})

router.delete('/removelike/:id', (req, res, next) => {
    db.query("DELETE FROM likes WHERE post_id = ? AND user_id = ?",[req.params.id, req.query.userId], (error, results, fields) => {
        if (error) return console.error(error.message);
        res.status(200).send(results);
    });
    console.log(req.query.postId);
    console.log(req.query.userId);
})

router.get('/liked', (req, res) => {
    db.query("SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
        [req.query.postId, req.query.userId],
        (err, result) => {

            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send(result);

        }

    )
})

router.get('/likes/:id', (req, res, next) => {
    db.query(`SELECT COUNT(id) AS count FROM likes WHERE post_id = ${req.params.id};`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            return res.status(200).send(result);
        }

    )

});

module.exports = router;

