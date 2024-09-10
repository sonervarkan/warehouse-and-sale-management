const express=require("express");

const router=express.Router();

const conn=require("../utility/database");



router.get("/stock/movements",(req,res)=>{
    const{stock_code}=req.query;
    if(!stock_code){
        return res.render("stockmovements", {datas:[]});
    }

    const sql=`SELECT stock_id, stock_code, stock_trade_mark, stock_category, stock_model, stock_added, total_quantity 
    FROM stocks WHERE stock_code=?`;
    conn.query(sql, [stock_code], (err, results)=>{
        if(err) throw err;
        res.render("stockmovements", {datas:results});
    });
  
});

router.post("/add-stock",(req,res)=>{
    const {stock_code, stock_trade_mark, stock_category, stock_model, movement_type, stock_date, stock_added}=req.body;
   
    const sql="INSERT INTO stocks (stock_code, stock_trade_mark, stock_category, stock_model, movement_type, stock_date, stock_added) VALUES (?,?,?,?,?,?,?)";
    conn.query(sql, [stock_code, stock_trade_mark, stock_category, stock_model, movement_type, stock_date, stock_added],(err,result)=>{
        if(err) throw err; 

         // take current total_quantity
         const getTotalQuantity = "SELECT total_quantity FROM stocks WHERE stock_code = ?";
         conn.query(getTotalQuantity, [stock_code], (err, rows) => {
             if (err) throw err;
             console.log(rows);


            if (rows.length > 0) {
                const currentQuantity = rows[0].total_quantity || 0;
                const newQuantity = currentQuantity + parseInt(stock_added, 10);
            
                // update new total_quantity
                const updateSql = "UPDATE stocks SET total_quantity = ? WHERE stock_code = ?";
                conn.query(updateSql, [newQuantity, stock_code], (err, result) => {
                    if (err) throw err;
                    res.redirect("/stock/movements");
                });
            }else {    
                const insertNewTotalQuantitySql = "INSERT INTO stocks (stock_code, total_quantity) VALUES (?, ?)";
                conn.query(insertNewTotalQuantitySql, [stock_code, parseInt(stock_added, 10)], (err, result) => {
                    if (err) throw err;
                    res.redirect("/stock/movements");
                });   
            }    
        });
    });
});

module.exports=router;