// console.log("Hello World");
// console.log("hi");

//commonjs type module (default setup)

//const http=require("http");
//const variable=require("./feature");


//module type module

/*
import http from "http";
import fs from "fs";
import os from 'os';
import path from 'path';

console.log(path.dirname("/home/ramdom/index.js"));

console.log(os.userInfo());
console.log(os.totalmem());
console.log(os.platform());
const aman=fs.readFileSync("./index.html"
    //console.log(aman);
)




//when variable is being imported as a default module
//import variable from "./feature.js";
//import {variable1,variable2} from "./feature.js";

import *as myObj from "./feature.js";

//import { variable, variable1,variable2 } from "./feature.js";

// const variable="haanji";
// console.log(myObj);
 const vari=myObj.func;
// console.log(vari());
 console.log(myObj.func());
// console.log(myObj.variable);
// console.log(variable);
// console.log(variable1);
// console.log(variable2);
//console.log(http);
const callback=(req,res)=>{

    if(req.url==="/about")
       res.end(`<h1>About Page ${vari()}</h1>`);

    else if(req.url==="/"){
        // fs.readFile("./index.html",(err,data)=>{
        //     res.end(data);
        // })
        console.log(req.method);
       res.end(aman);

    }

    else
       res.end("ALICE");
    
    //console.log(req.url);
   // res.end("<h1>sweety</h1>");
   // res.end("sweety");
   // console.log("Server is Working");
    //callback();
}

const server=http.createServer(callback).listen(5000,'127.0.0.1',()=>{
        console.log("it's me");
     })
   // console.log(server);

//console.log(aman);

//server(callback);
//  server.listen(5000,()=>{
//     console.log("it's me");
//  })
//console.log(server);
// const add=(a,b,c)=>{
//     console.log(a+b+c);
// }

// add(2,34,5);

*/


import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

//for connecting with database URI is being passed to it 
mongoose.connect("mongodb://localhost:27017",{
   dbName:"backend",
}).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
})

const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  password:String

});

const User=mongoose.model("User",userSchema);

const messageSchema=new mongoose.Schema({
   name:String,
   email:String,
   password:String
});

const Messge=mongoose.model('Message',messageSchema);

const app=express();
const users=[];
//specifying the default engine if the extension is not being written with the file name
//app.set('view engine', 'ejs');

//since we havenot specified any routes so it would be executed on each request to the server from the client
app.use(express.static(path.join(path.resolve(),"public")));

//middleware to extract the submitted data from the request body
app.use(express.urlencoded({extended:true}));

//for accessing cookies via the req
app.use(cookieParser());


var aman;

const isAuthenticated=async (req,res,next)=>{

   const {token}=req.cookies;
   if(token){
      //console.log(req.body);
      const decoded=jwt.verify(token,"amankumar");
      console.log(decoded);

      aman=await User.findById(decoded._id);
      req.user=await User.findById(decoded._id);
      next();
     //res.render("logout.ejs");
   }
   else
     res.render("login.ejs");


}



//for dealing with the /success route in which we are redirected after form submission
app.get("/success",(req,res)=>{
   res.render("success.ejs");
})

app.get("/add",(req,res)=>{
   
   // console.log(req.body.name);

   Messge.create({
      name:"Abhi",
      email:"aman@gmail.com"
   }).then(()=>{
      res.send("NICE");
});
   // new Messge({
   //    name:req.body.name,
   //    email:req.body.email
   // }).save().then(()=>{console.log("saved to DB")}).catch((err)=>{
   //    console.log(err);
   // })

});
//for generating all the users
app.get("/users",(req,res)=>{
   //res.send(users);
   //console.log(req.body);
console.log(req.body.name);
   
   
   //alternative to send
   //for JSON format
   res.json({
      users
   })
})

app.get("/register",async(req,res)=>{

   return res.render("register.ejs",{email:req.body.email,message:"please register first"});

});


app.post("/register",async(req,res)=>{

   const {name,email,password}=req.body;
   
   const hashedPassword=await bcrypt.hash(password,10);

   const user=await User.create({
      name:name,
      email:email,
      password:hashedPassword
   })

   // const user= await new User({
   //    name:name,
   //    email:email,
   //    }). save().then(()=>{
   //     console.log("user added to the DB");
   //  }).catch((err)=>{
   //    console.log(err.message);
   //  });
    //user._id is not availabe with user.save()
   console.log(user._id);

    const token=jwt.sign({_id:user._id},"amankumar");
    console.log(token);
   
   // res.cookie("name",name,{
   //    httpOnly:true,
   //    expires:new Date(Date.now()+130*1000),
   // });
   // res.cookie("email",email,{
   //    httpOnly:true,
   //    expires:new Date(Date.now()+130*1000),
   // });
   res.cookie("token",token,{
      httpOnly:true,
      expires:new Date(Date.now()+60*1000),
   })

    res.redirect("/");

})



app.post("/login",async(req,res)=>{

   const {name,email}=req.body;
   
   let user=await User.findOne({email:email})
   if(!user){
    
      res.redirect("/register");

    
   }

   else{
   
      res.redirect("/logout");
     console.log('found user',user);

   }
       




});

app.get("/logout",(req,res)=>{
 
   //resetting the cookie
   res.cookie("token",null,{
      expires:new Date(Date.now())
   });
   res.status(301).redirect("/");

})
// const d = new Date(86400*1000);

// console.log(d);
// console.log(new Date());
// console.log(new Date(Date.now()));


app.post("/contact",(req,res)=>{
   console.log(req.body);
   //since it returns an object of key-value pairs so we can access individual members to
   console.log(req.body.nambo);

   users.push({username:req.body.nambo ,email:req.body.email});
   console.log(users);

   const {nambo,email}=req.body;//destructuring the body

    new Messge({
      name:nambo,
      email,//if key-value pair has same name then there is no need to write both of them
     // name:req.body.nambo,
      //email:req.body.email,
   }).save().then(()=>{console.log("saved to DB")}).catch((err)=>{
      console.log(err.message);
   })


   //rendering the success file on post request
   //res.render("success.ejs");

   //another way of doing it out is to use redirect method which take route as its argument
   res.redirect("/success");
})
app.get("/",isAuthenticated,(req,res)=>{


   console.log(aman);
   //console.log(req.body.name);
   console.log(req.user);

  // res.render("/login");
   res.render("logout.ejs",{name:req.user.name});
   //taken is isAuthenticated function
   // console.log(req.cookies);
   // if(req.cookies.token)
   //   res.render("logout.ejs");
   // else 
   //   res.render("login.ejs");
   //res.render("index.ejs",{name:"Aman"});
  // console.log(path.join(path.resolve(),"public","index.html"));
  // res.sendFile(path.join(path.resolve(),"public","index.html"));
   //res.sendFile("index");


   // console.log(path.join("aman","sweet"));
   // const direc=path.resolve();
   // res.sendFile(path.join(direc,"index.html"));
   // res.json({
   //    "success":true,

   //    "products":[]
   // });
   //res.send("hi");
  // res.sendStatus(404);
   //res.send("hello");
  // res.end("<h1>hello there</h1>")
})

app.listen(5000,()=>{
   console.log("server is working");
})
