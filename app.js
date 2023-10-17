const http = require('http');
const express = require('express');
const app = express();

app.use(express.json());

const server = http.createServer(app);

const { signUp } = require('./server/userSignUp');
const { threadsContent } = require('./server/userContents');
const { allContent } = require('./server/userAllContent');
const { detailContent } = require('./server/detailedContent');
const { userUpdate } = require('./server/upDate');
const { deleteContent } = require('./server/contentDelete');
const { pushLike } = require('./server/likes');


//1. 회원가입
app.post('/sign-Up', signUp);
//2. 게시글 등록
app.post('/user/contents', threadsContent);
//3. 전체 게시글 조회
app.get('/user/userContents', allContent);
//4. 유저 게시글 조회 보류
app.get('/user/detail', detailContent);
//5. 게시물 수정( 업데이트 )
app.put('/user/update/', userUpdate);
//6번. 게시글 삭제
app.delete('/user/deleted', deleteContent)
//7번 좋아요 누르기
app.post('/user/like', pushLike)



const start = async() => {
    server.listen(8000, () => console.log('port is 8000'))
}

start();
