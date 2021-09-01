const mysql = require('mysql');
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

module.exports ={
        db : mysql.createConnection(
            {
                user: "zlatin",
                host: "localhost",
                password: "Kriseto090888",
                database: "test",
            }
        )
}