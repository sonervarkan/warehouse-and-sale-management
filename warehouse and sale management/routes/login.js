const express = require("express");
const session=require("express-session");
const bodyParser = require("body-parser");
const conn = require("../utility/database");


const router = express.Router();

router.use(bodyParser.urlencoded({extended:true}));

router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    conn.query(sql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect("/"); 
        } else {
            res.render("login", { message: "Username or password is incorrect!", user: null });
        }
    });
});


function authCheck(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}


router.get("/", authCheck, (req, res) => {
    res.render("index", { user: req.session.user });
});


router.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/"); 
    }
    res.render("login", { message: null });
});


router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
