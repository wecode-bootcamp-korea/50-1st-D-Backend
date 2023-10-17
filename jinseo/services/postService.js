const { appDataSource } = require('../app');
//게시글 등록 코드 by.진서
const createPost = async(req,res) => {
  const postTitle = req.body.title
  const postContent = req.body.content
  const userID = req.body.user_id

  const postData = await appDataSource.query(`
  INSERT INTO posts (
    title,
    content,
    user_id
  )
  VALUES (
    '${postTitle}',
    '${postContent}',
    '${userID}'
  )
  `)
  console.log("TYPEORM RETURN DATA: ",postData);
  return res.status(201).json({"message":"게시글을 쓰셨군요 ㅎㅎ"})
}

//전체 게시글 조회하기
const allpostView = async(req,res) => {

const allPost = await appDataSource.query(`
  SELECT users.id AS userId, users.profile_image AS userProfileImage, 
       posts.id AS postingId, posts.content AS postingContent
  FROM users
  INNER JOIN posts ON users.id = posts.user_id;
  `)
 
  console.log("TYPEORM RETURN DATA");
  return res.status(200).json({ data :allPost});
  
  }

//특정 유저 게시글 조회
const usersPost = async(req,res) => {
    const userID = req.body.user_id;
  
    const userPost = await appDataSource.query(`
    SELECT 
    users.id AS userId, 
    users.profile_image AS userProfileImage, 
    posts.id AS postingId, 
    posts.content AS postingContent
    FROM users
    INNER JOIN posts ON users.id = posts.user_id
    WHERE users.id = ${userID};
    `)
    const result = {
      data: {
          userId: userPost[0].userId,
          userProfileImage: userPost[0].userProfileImage,
          postings: []
      }
  };
    for (const row of userPost) {
      result.data.postings.push({
          postingId: row.postingId,
          postingContent: row.postingContent
      });
  }

    console.log("TYPEORM RETURN DATA");

    return res.status(200).json(result);
    
  }

 //게시글 수정(Update)하기
 const updatePost = async (req,res) =>{
  //1-1 Request로부터 필요한 데이터들을 받아오자
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.body.userId;

  //1-2. 데이터베이스 상에서 게시물 데이터를 수정단계
    //1-2-1. 수정하려는 게시물의 존재 여부 확인단계
    const existingPost = await appDataSource.query(`
    SELECT id,title,content,user_id
    FROM posts
    WHERE id = ${postId};
    `);
    
    // 게시물이 없는 경우의 코드를 작성하자 -> 오류 방지
    if(existingPost.length===0){ //existingPost 가 빈 상태에 실행되는 코드 -> 비었다는건 존재하지 않는 다는 거니까
      return res.status(404).json({"message":"POST_NOT_FOUND"});
    }
    //게시물이 있는 경우 수정단계 코드로 넘어가면 되니 추가적으로 작성 할 코드 없음

  //1-2-2. 게시물 확인 단계 이후 수정하려는 사람의 존재여부를 판단하는 단계
    const existingUser = await appDataSource.query(`
    SELECT id,email
    FROM users
    WHERE id= ${userId};
    `)

    //게시글과 마찬가지로 유저의 존재여부 확인단계 -> 존재하지 않는 경우 오류방지를 위해 코드 작성하자
    if(existingUser.length===0){
      return res.status(401).json({"message":"UNAUTHORIZED"});
    }
    //유저가 있는 경우는 게시글과 마찬가지로 그 다음 단계로 진행하면 된다.

  //1-2-3. 게시글, 유저의 존재여부를 확인 했으니 해당 게시글의 작성자가 맞는지 확인하는 단계
  const postingUser = existingPost[0].user_id;
  const user = existingUser[0].id;
    //권한이 없는 사람이 접근한 경우 -> 권한이 없다고 답변
    if(postingUser!==user){
      return res.status(403).json({"message":"잘못된 접근입니다. UNAUTHENTICATED"});
    };
    //권한이 일치하는 사람인 경우 -> 포스터 수정 코드 실행
    const updatedPost = await appDataSource.query(`
      UPDATE posts
      SET title = '${title}',
          content = '${content}'
      WHERE id = ${postId}    
    `)
  
  //1-3. 데이터 수정되었는지 확인
  console.log("수정: ","UPDATED POST");
  
  //1-4. front에게 수정되었다고 전달 -> 요즘엔 내용도 같이 보내주는 편
  return res.status(200).json({
    "message":"POST_UPDATED",
    "updatedData":{
      "title":title,
      "content":content
    }
  })
};
    

  //함수 내보내주자
  module.exports = {
    allpostView, 
    usersPost, 
    createPost,
    updatePost
  };