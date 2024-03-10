const express=require("express");

const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser')

const path=require('path')

const urlrouter=require('./router/user')
const fromfront=require('./router/frontrouter')
const staticRoute = require("./router/staticRoute");

const URL=require('./models/user')

const {cheakForAuthentication,restrictTo}=require('./middlewate/auth')

const {ConnectionDB}=require('./connection')

const app=express();
const port=4000;

ConnectionDB('mongodb+srv://satyamguptabt:cBF9gfEM7UoLo3Lo@cluster0.uig8tdn.mongodb.net/')



app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.json());
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: 'Invalid JSON' });
    } else {
      next();
    }
  });
  
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cheakForAuthentication);

app.use("/url",restrictTo(["Normal","Admin"]),urlrouter)
app.use("/test",fromfront)
app.use("/",  staticRoute);



app.listen(port ,()=>{
    console.log(`server started at port ${port}`)
})
    
