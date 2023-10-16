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

  //함수 내보내주자
  module.exports = {
    allpostView, 
    usersPost, 
    createPost
  };