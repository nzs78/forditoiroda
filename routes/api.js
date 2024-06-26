var express = require('express');
var router = express.Router();
// ******************************************************************
// Publikus API

/* GET arak üzenetek */
router.get('/arak', (req, res, next) => {
    console.log("/arak kérés érkezett");
    const arak = {
        minar: "Minimum: 8500 Ft + ÁFA",
        szakirany: "okleveles szakfordító, extra nyelvi lektor",
        idotartam: "1-2 munkanap / 2500 karakter vállalási idő",
        karakterar: 23
    };
    res.send(arak);
});

// ******************************************************************

// Admin felület API-jai
// Admin felület specifikus objektumok

// SQL fájl felolvasása, paraméterek a szerverhez kapcsolódáshoz, Adatbázis név!
var mysql = require('mysql');
var sqlTasks = require('../assets/sqlTasks.json');
const getSqlTasks = require('../assets/sqlTasks');
var dbName = 'iroda';
var db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: dbName
};

/* Általános SQL query */
const databaseQuery = sqlQuery => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(db);
        connection.connect();
        console.log('sqlQuery', sqlQuery);
        connection.query(sqlQuery, (error, lines, fields) => {
            if (error) reject(error);
            resolve(lines);
            connection.end();
        })
    })
};

/* GET sqlTasks */
router.get('/sqltasks', function (req, res, next) {
    res.send(JSON.stringify(sqlTasks))
});
/* fech data from database */
router.get('/lekerdezes/:id', function (req, res, next) {
    getSqlTasks().then(result => {
        console.log("API hívás érkezett: lekérdezés futtatása:", req.params['id'], ' sorszámmal.');
        const sqlTasks = result;
        const sqlTaskById = sqlTasks.filter(task => task.id == req.params.id);

        if (sqlTaskById) {
            sqlTask = sqlTaskById[0];
            if (sqlTask.sql) {
                databaseQuery(sqlTask.sql)
                    .then(result => {
                        res.send(JSON.stringify(result))
                    })
                    .catch(error => {
                        console.error("Hiba történt az SQL parancs végrehajtása során:", error.sqlMessage ? error.sqlMessage : error.code);
                        res.status(error.status || 500);
                        if (error.code && error.code === "ER_BAD_DB_ERROR") {
                            console.error("Még nincsen létrehozva a feladathoz szükséges adatbázis!");
                            res.send(JSON.stringify({error: error.code}))
                        } else if (error.code && error.code === "ER_NO_SUCH_TABLE") {
                            console.error("Még nincsen létrehozva a feladathoz tartozó tábla!");
                            res.send(JSON.stringify({error: error.code}))
                        } else if (error.code && error.code === "ECONNREFUSED") {
                            console.error("Nem sikerült a MySQL adatbázis szerverhez kapcsolódni.");
                            res.send(JSON.stringify({error: error.code}))
                        } else if (error.sqlMessage) {
                            console.log(error.sqlMessage);
                            res.send(JSON.stringify({error: error.sqlMessage}))
                        } else {
                            console.log(JSON.stringify(error));
                            res.send(JSON.stringify({error: 'Ismeretlen eredetű hiba!'}))
                        }
                    })
            } else {
                console.log("Ehhez a feladathoz még nem szerepel SQL lekérdezés a beadandó fájlban.");
                res.send(JSON.stringify({empty: true}))
            }
        }
    })
});


// Szerver monitoring endpointok
/* GET server status monitoring */
router.get('/serverStatus', function (req, res, next) {
    res.send(JSON.stringify({alive: true}))
});
/* GET SQL mysqlServerStatus monitoring */
router.get('/mysqlServerStatus', function (req, res, next) {
    new Promise((resolve, reject) => {
        const dbOnly = {
            host: 'localhost',
            user: 'root',
            password: '',
        };
        const sqlQuery = ' select version();';
        const connection = mysql.createConnection(dbOnly);
        connection.connect();
        connection.query(sqlQuery, (error, lines, fields) => {
            if (error) reject(error);
            resolve(lines);
            connection.end();
        })
    }).then(result => {
        res.send({alive: true})
    }).catch(error => {
        res.send({alive: false})
    });
});
/* GET SQL mysqlTableStatus monitoring */
router.get('/mysqlTableStatus', function (req, res, next) {
    databaseQuery(' select version();')
        .then(result => {
            res.send({alive: true})
        })
        .catch(error => {
            res.send({alive: false})
        })
});

// export
module.exports = router;

