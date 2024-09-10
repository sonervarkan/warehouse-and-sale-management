const mysql2=require("mysql2");
const app=require("../app");


const conn=mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"guvenler"
});

conn.connect((err)=>{
    if(err) throw err;
    console.log("Database connected...");
});


module.exports=conn;