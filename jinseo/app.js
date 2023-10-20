const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm')
const dotenv = require("dotenv")
const mysql = require('mysql2')
const { create } = require('domain')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config()

const appDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: '3306',
  username: 'root',
  password: '12345678',
  database: 'wethreads'
})

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json()) // for parsing application/json

// Health Check function
app.get("/ping", async(req, res) => {
  res.status(200).json(
    { message:"pong" }
  )
});
module.exports = { appDataSource} ;
const { signUp,signIn } = require('./services/userService');
const { getThread,createThread,deleteThread, showThread,updateThread,commentThread,likeThread,unlikeThread } = require('./services/postService');

// 2. 우리의 Express app에 회원가입 하는 함수 연결
// 2-1. HTTP method와 HTTP url 같이 설정 하여 연결
app.post("/users/signup", signUp);
app.post("/users/signin",signIn);

app.get("/thread",showThread);
app.get("/thread/:threadId",getThread);

app.post("/thread/createThread",createThread);
app.delete("/thread/:threadId",deleteThread);

app.put("/thread/:threadId",updateThread);

app.post("/thread/:threadId",commentThread);
app.post("/thread/:threadId/like", likeThread);
app.delete("/thread/:threadId/like",unlikeThread);

// app.get("/userPost",usersPost);
// app.get("/allposts",allpostView);  
// app.post("/posts/create-post",createPost);
// app.put("/posts/:postId", updatePost);


const server = http.createServer(app) // express app 으로 서버를 만듭니다.

const start = async () => { // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`WELCOME-50-1st-D-SERVER!`))
    
    appDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!")
    })
  } catch (err) { 
    console.error(err)

  }
}

start();
