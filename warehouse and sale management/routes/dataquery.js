const express = require("express");
const router = express.Router();
const mysql=require("mysql2");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));

const conn = require("../utility/database");

router.get("/data-queries", (req, res) => {
    res.render("dataquery");
});

router.get('/sales/customers', (req, res) => {
    const { attribute, value } = req.query;

    if (!attribute || !value) {
        return res.render('customers', { datas: [] });
    }

    const sql = `SELECT * FROM customers WHERE ${attribute}=?`;

    conn.query(sql, [value], (err, results) => {
        if(err) throw err;
        res.render('customers', { datas: results });
        console.log(results);
    });

});

router.get("/sales/products",(req,res)=>{
    const {attribute,value}=req.query;

    if(!attribute || !value){
        return res.render("products", {datas:[]});
    }
    const sql=`SELECT * FROM products WHERE ${attribute}=?`;

    conn.query(sql, [value], (err, results)=>{
        if(err) throw err;
        res.render("products", {datas:results});
    });
  
});

router.get("/sales/sales",(req,res)=>{
    const {attribute, value}=req.query;
    if(!attribute||!value){
        return res.render("sales",{datas:[]});
    }
    const sql=`SELECT * FROM sales WHERE ${attribute}=?`;
    conn.query(sql, [value],(err, results)=>{
        if(err) throw err;
        res.render("sales", {datas:results});
    });
 
});

router.get("/sales/invoices", (req,res)=>{
    const {attribute, value}=req.query;

    if(!attribute || !value){
        return res.render("invoices", {datas:[]});
    }
    if (attribute === 'date') {
        let day, month, year;
        if (value.includes("/")) {
            [year, month, day] = value.split("/");
        }
        else if (value.includes(".")) {
            [year, month, day] = value.split(".");
        }
        else if (value.includes("-")) {
            [day, month, year] = value.split("-");
        }else{
            return res.render("error", { message: "Invalid format" });
        }
        const formattedDate = `${year}-${month}-${day}`;
     
    }
    const sql=`SELECT * FROM invoices WHERE ${attribute}=?`;
    conn.query(sql, [value], (err, results)=>{
        if(err){

            return res.render("error", { message: "Database error" });
           
        }; 
        res.render("invoices", {datas:results});
    });
    
});

router.get("/sales/multiple-query", (req,res)=>{
    const {attribute, value}=req.query;

    if(!attribute || !value){
        return res.render("multiplequery", {datas:[]});
    }
    if (attribute === 'date') {
        let day, month, year;
        if (value.includes("/")) {
            [year, month, day] = value.split("/");
        }
        else if (value.includes(".")) {
            [year, month, day] = value.split(".");
        }
        else if (value.includes("-")) {
            [day, month, year] = value.split("-");
        }else{
            return res.render("error", { message: "Invalid format" });
        }
        const formattedDate = `${year}-${month}-${day}`;
    }
    const sql= `SELECT 
    stocks.stock_code,
    sales.sale_id, 
    sales.sale_quantity, 
    sales.total_price, 
    sales.productId, 
    sales.customerId, 
    sales.invoiceId, 
    customers.customer_name,
    customers.customer_surname, 
    customers.email, 
    customers.address, 
    products.product_name, 
    products.category, 
    products.description, 
    products.price, 
    invoices.invoice_number, 
    invoices.date 
    FROM 
        sales 
    JOIN 
        customers ON sales.customerId = customers.customer_id 
    JOIN 
        products ON sales.productId = products.product_id 
    JOIN 
        invoices ON sales.invoiceId = invoices.invoice_id 
    JOIN 
        stocks ON sales.stockId = stocks.stock_id
    WHERE 
        ${attribute} = ?;`;
    conn.query(sql, [value], (err, results)=>{
        if(err){

            return res.render("error", { message: "Database error" });
           
        }; 
        res.render("multiplequery", {datas:results});
    });


});

module.exports = router;
