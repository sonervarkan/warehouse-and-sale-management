const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
    secret: 'gizli-anahtar', 
    resave: false,
    saveUninitialized: true
}));

const conn=require("./utility/database");

const routerSale=require("./routes/saleform");
app.use(routerSale);

const routerDataQuery=require("./routes/dataquery");
app.use(routerDataQuery);

const routerStockMovements=require("./routes/stockmovements");
app.use(routerStockMovements);

const routerLogin=require("./routes/login");
app.use(routerLogin);

const routerRegister=require("./routes/register");
app.use(routerRegister);

app.listen( 3000);