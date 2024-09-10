const express=require("express");

const router=express.Router();

const conn=require("../utility/database");

router.get("/register", (req,res)=>{
    res.render("register");
});



router.post("/register", (req,res)=>{
    const {username, password,role,email}=req.body;
    const sql="INSERT INTO users (username, password,role,email) VALUES (?,?,?,?)";
    conn.query(sql, [username, password,role,email], (err, results)=>{
        if(err) throw err;
        res.redirect("/");
    });
   
});


module.exports=router;