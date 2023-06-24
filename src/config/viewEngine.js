// dùng để tạo hàm
import  express  from "express";   
let configViewEngine = (app) =>
{
    app.use(express.static("./src/public"));// muốn truy cập thì chỉ lấy trên public
    app.set("view engine","ejs");//  es  = jsp, blasde: gõ logic trong html
    app.set("views","./src/views") // 
}
module.exports = configViewEngine;
