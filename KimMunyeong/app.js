const http = require('http');
const express = require('express');
//const { DataSource } = require('typeorm');
const { signUp } = require('./server-1/userSign');
const { threadsContent } = require('./server-1/threadsContents');
const { userAllContents } = require('./server-1/usersAll');
const { userContentsData } = require('./server-1/usersData');
const { userUpdate } = require('./server-1/contentsUpdate');
const { userDelete } = require('./server-1/contentsDelete');
const { userLike } = require('./server-1/usersLikes');
const app = express();
const server = http.createServer(app);

app.use(express.json());

//
//const { appDataSource } = require('./database');


// 1번
app.post('/users/sign-up', signUp);


//2번
app.post('/user/threads', threadsContent);
//


//3번
app.get('/user/contents1', userAllContents);


//4번(이게 아닌 것 같은데...)
app.get('/userContent', userContentsData);


//5번
app.put('/update', userUpdate)

// postman 실행시 Body에 객체 입력
// {
//     "content": "기존과 다르게 수정한 내용입니다.",
//     "user_id": 3,
//     "id": 4
// }


//6번
app.delete('/delete', userDelete)


//7번
app.post('/likes', userLike)



// const server = http.createServer(app);


const start = async () => {

    server.listen(8000, () => console.log('port is 8000'))
    // try {
    //     signUp.appDataSource.initialize()
    //         .then(() => {
    //             console.log('data source')
    //         })
    // } catch (err) {
    //     console.error(err)
    // }

}

start()