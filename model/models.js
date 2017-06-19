var sqlite3 = require('sqlite3').verbose();
var db;

function connectDB() {
    console.log("connecting to DB");
    db = new sqlite3.Database('./model/contact.sqlite3');
}

function creatTable() {
    console.log("creating table\n");
    db.run("CREATE TABLE IF NOT EXISTS contactmanager (lastname TEXT, firstname TEXT, phone TEXT)");
}

function insertData(lastname, firstname, phoneNo) {
    // console.log("Inserting data");
    var stmt = db.prepare("INSERT INTO contactmanager VALUES (?, ?, ?)");

    stmt.run(lastname, firstname, phoneNo, function(err) {
        if (err) throw err;
    });
    stmt.finalize();

}

function fetchLastnameData(query, next) {
    // console.log("fetching lastname data");

    var stmt = db.prepare("SELECT lastname, firstname, phone FROM contactmanager WHERE lastname = ?");

    stmt.all(query, function(err, rows) {
        if (err) throw err;
        // console.log(rows);
        next(rows);
    });
}

function fetchFirstnameData(query, next) {
    // console.log("fetching firstname data");

    var stmt = db.prepare("SELECT lastname, firstname, phone FROM contactmanager WHERE firstname = ?");

    stmt.all(query, function(err, rows) {
        if (err) throw err;
        // console.log(rows);
        next(rows);
    });
}

function fetchFLData(fn, ls, next) {
    // console.log("fetching fl data");
    var stmt = db.prepare("SELECT lastname, firstname, phone FROM contactmanager WHERE firstname = ? AND lastname = ?");

    stmt.all(fn, ls, function(err, rows) {
        if (err) throw err;
        // console.log(rows);
        next(rows);
    });
}

function deleteData(fn, ls, next) {
    // console.log("fetching fl data");
    var stmt = db.prepare("DELETE FROM contactmanager WHERE firstname = ? AND lastname = ?");

    stmt.all(fn, ls, function(err, rows) {
        if (err) throw err;
        // console.log(rows);
        next(rows);
    });
}

function closeDB() {
    console.log("closing DB");
    db.close();
}

function initialize() {
    connectDB();
    creatTable();
}

module.exports = {
    init: initialize,
    insert: insertData,
    fetchlastname: fetchLastnameData,
    fetchfirstname: fetchFirstnameData,
    fetchfldata: fetchFLData,
    deletedata: deleteData,
    close: closeDB,
};