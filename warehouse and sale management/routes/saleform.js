const express=require("express");
const router=express.Router();

const connection=require("../utility/database");

const bodyParser=require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));

router.get("/sale-form",(req,res)=>{
    res.render("saleform");
});



router.post("/sell-items",(req,res)=>{
    const {stock_code, customer_name, customer_surname, email, address, product_name, category, price, 
        description, invoice_number, date, sale_quantity, total_price, total_quantity} = req.body;
        console.log(req.body);

    const stockQuery = 'SELECT total_quantity FROM stocks WHERE stock_code = ?';
    connection.query(stockQuery, [stock_code], (err, result) => {
        if (err) throw err;
        
        if (result.length === 0) {
            return res.status(400).send("No stock found.");
        }

        const totalQuantity = result[0].total_quantity;


        if (!totalQuantity || totalQuantity < sale_quantity) {
            return res.status(400).send("Insufficient stock. Current stock quantity: " + totalQuantity);
        }
            
            

        // Insert into customers table
        const customerQuery = 'INSERT INTO customers (customer_name, customer_surname, email, address) VALUES (?, ?, ?, ?)';
        'SET @last_id = LAST_INSERT_ID()';
        connection.query(customerQuery, [customer_name, customer_surname, email, address], (err, result) => {
            if (err) throw err;      
            const customerId = result.insertId;


            // Insert into products table
            const productQuery = 'INSERT INTO products (product_name, category, price, description) VALUES (?, ?, ?, ?)';
            connection.query(productQuery, [product_name, category, price, description], (err, result) => {
                if (err) throw err;
                const productId = result.insertId;

                // Insert into invoices table
                const invoiceQuery= 'INSERT INTO invoices (invoice_number, date) VALUES (?,?)';
                connection.query(invoiceQuery, [invoice_number, date], (err,result)=>{
                    if(err) throw err;
                    const invoiceId = result.insertId;

                    
                    // take stock_id
                    const stockQuery = 'SELECT stock_id FROM stocks WHERE stock_code = ?';
                    connection.query(stockQuery, [stock_code], (err, result) => {
                        if (err) throw err;
                        if (result.length === 0) {
                            return res.status(400).send("No stock found.");
                        }
                        const stockId = result[0].stock_id;
                        
                        // Insert into sales table
                        const saleQuery='INSERT INTO sales (sale_quantity, total_price, invoiceId, productId, customerId, stockId) VALUES (?, ?, ?, ?, ?, ?)';
                        connection.query(saleQuery, [sale_quantity, total_price, invoiceId, productId, customerId, stockId], (err, result)=>{
                            if(err) throw err;
                        });
                        const minusStockCode="UPDATE stocks SET total_quantity=total_quantity - ? WHERE stock_code=?";
                        connection.query(minusStockCode, [sale_quantity, stock_code],(err, result)=>{
                            if(err) throw err;
                            res.redirect("/");                   
                        });
                    });
                });
            });
        });
    });
});
module.exports=router;