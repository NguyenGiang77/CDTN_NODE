import  express  from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouter from "./route/web";
import connectDB from './config/connectDB';
//import cors from 'cors';
require('dotenv').config();

let app = express();
//app.use(cors({ origin: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(function (req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
viewEngine(app);
initWebRouter(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port,() =>
{
    console.log("backend CDTN is running" + port)
})
