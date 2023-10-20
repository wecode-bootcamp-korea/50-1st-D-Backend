const { appDataSource } = require('../app');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

//전체 쓰레드 구경해보자
const showThread = async(req,res)=>{
  try{
    const getThread = await appDataSource.query(`
        SELECT
        users.nickname,
        users.profile_image AS profileImage,
        threads.id AS threadId,
        threads.content,
        threads.created_at AS createdAt,
        threads.updated_at AS updatedAt,
        COUNT(thread_comments.id) AS commentCount
        FROM threads
        INNER JOIN users ON threads.user_id = users.id
        LEFT JOIN thread_comments ON threads.id = thread_comments.thread_id
        GROUP BY threads.id, users.nickname, users.profile_image, threads.content, threads.created_at, threads.updated_at
        ORDER BY threads.created_at DESC;
        `) 
   
    return res.status(200).json({
      "message":"ALL_THREAD_SUCCESS",
      data:getThread
    });
     
  } catch(err){
    return res.status(400).json({ error: "오류가 발생했어"});
  };
};

//특정 쓰레드 구경해보자
const getThread = async(req, res) => {
  const threadId = req.params.threadId;

  try {
    // 해당 쓰레드 가져오기
    const threadQuery = `
      SELECT threads.id AS threadId, threads.content, threads.created_at AS createdAt, 
      threads.updated_at AS updatedAt, users.nickname, users.profile_image AS profileImage
      FROM threads
      INNER JOIN users ON threads.user_id = users.id
      WHERE threads.id = ${threadId}
    `;

    const thread = await appDataSource.query(threadQuery);

    if (thread.length === 0) {
      return res.status(404).json({ message: "THREAD_UNDEFINED" });
    }

    // 해당 쓰레드의 댓글 가져오기
    const commentsQuery = `
      SELECT thread_comments.id AS commentId, thread_comments.content AS commentContent, thread_comments.created_at AS commentCreatedAt, 
      thread_comments.updated_at AS commentUpdatedAt, users.nickname AS commentNickname, users.profile_image AS commentProfileImage
      FROM thread_comments
      INNER JOIN users ON thread_comments.user_id = users.id
      WHERE thread_comments.thread_id = ${threadId}
    `;

    const comments = await appDataSource.query(commentsQuery);

    return res.status(200).json({
      message: "GET_THREAD_SUCCESS",
      data: {
        thread: thread[0],
        comments: comments
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "오류가 발생했어" });
  };
}
//쓰레드 남기기
const createThread = async(req,res) =>{
  try{
    const token = req.headers.authorization;
    console.log(token);
    //토큰이 있는 경우 유효성 검사해봅시다.
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId = id.id;
    //입력한 쓰레드 내용 받아오기 (한 글자 이상 조건)
    const content = req.body.content;
    //글자수 제한을 어겼을때 오류메시지
    if (content.length<=1){
      return res.status(400).json({ error: "CONTENT_TOO_SHORT" });
    };
    //쓰레드 데이터베이스 저장하자 (애초에 토큰을 id + SECRE_KEY 로 만들어서 유효성 검사후에 변수 id 엔 id가 남는다.)
    const newThread = await appDataSource.query(`
    INSERT INTO threads (
        user_id,
        content
    ) VALUES (
        '${userId}',
        '${content}'
    );
    `)
    //백엔드 확인용
    console.log("New Thread userID: ", userId);
    console.log("New Thread Content: ",content);

    //front에 성공메시지 보내주기
    return res.status(200).json({"message":"NEW_THREAD_CREATED"});
  } catch(err) {
     //토큰 값이 틀린 경우
     if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    }
    return res.status(400).json({ error: "오류가 발생했어"});
  };
};

//쓰레드 수정해보자
const updateThread = async(req,res)=>{
  const threadId = req.params.threadId;
  const { content } = req.body;
 
  const token = req.headers.authorization;
  
    try {
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId = id.id;
    //게시물 존재여부 확인
    const existingThread =await appDataSource.query(`
      SELECT id, user_id
      FROM threads
      WHERE id = ${threadId}
    `);

    if (existingThread.length === 0) {
      return res.status(404).json({ message: "THREAD_NOT_FOUND" });
    }
    
    //유저 존재 여부 확인
    const existingUser = await appDataSource.query(`
    SELECT id
    FROM users
    WHERE id = ${userId}
    `);
    
    if (existingUser.length === 0) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    
    // 3. 게시물 작성자 확인
    const postingUser = existingThread[0].user_id;
    const user = existingUser[0].id;

    if (postingUser !== user) {
      return res.status(403).json({ message: "UNAUTHENTICATED" });
    };
    // 4. 게시물 수정
    await appDataSource.query(`
    UPDATE threads
    SET content = '${content}'
    WHERE id = ${threadId}
    `);

    // 5. 응답 보내기
    return res.status(200).json({
      message: "THREAD_UPDATED",
      updatedData: {
      content,
      },
});

  } catch (error) {
     //토큰 값이 틀린 경우
     if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    };
    return res.status(500).json({ message: "오류가 발생했어!" });
    };

};

//쓰레드 삭제해보자
const deleteThread = async(req, res) => {
  const threadId = req.params.threadId;
  const token = req.headers.authorization;
  try {
    // 토큰 유효성 검사
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId = id.id;

    // 쓰레드 존재유무 파악하자
    const existingThread = await appDataSource.query(`
      SELECT id, user_id
      FROM threads
      WHERE id = ${threadId};
    `)
    // 쓰레드 존재하지 않을 때
    if (existingThread.length === 0) {
      return res.status(400).json({ message: "쓰레드가 존재하지 않습니다" });
    };
    // 쓰레드 작성자와 토큰의 사용자가 일치하는지 확인 후 일치하지 않은 경우
    if (existingThread[0].user_id !== userId) {
      return res.status(400).json({ message: "잘못된 접근입니다" });
    }
    // 쓰레드 삭제 실행
    await appDataSource.query(`
      DELETE FROM threads
      WHERE id = ${threadId}
    `)
    return res.status(200).json({ message: "THREAD_DELETE_SUCCESS" });

  } catch (err) {
    // 토큰 유효성 검사 통과 못했을시
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    };
    return res.status(500).json({ message: "오류가 발생했습니다." });
  }
};

//댓글을 달아보자
const commentThread = async(req,res)=>{
  const threadId = req.params.threadId;
  const { content } = req.body;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ error: "저장된 토큰이 없습니다." });
  }

  try{
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId =id.id;
    //댓글 작성자 존재여부 확인
    const existingUser = await appDataSource.query(`
    SELECT id
    FROM users
    WHERE id = ${userId}
    `);
    if (existingUser.length === 0) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    //댓글 작성 가보자
    const newComment = await appDataSource.query(`
    INSERT INTO thread_comments (
      thread_id,
      user_id,
      content
    ) VALUES (
      '${threadId}',
      '${id.id}',
      '${content}'
    );
    `)

    //백엔드 확인용
    console.log("NEW COMMENT CONTENT : ",newComment);
    return res.status(200).json({
      "message":"NEW_COMMENT_REGISTERED"
    });
  }catch(err) {
     //토큰 값이 틀린 경우
     if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    }
    return res.status(500).json({ message: "오류가 발생했어!" });
    };
};

//쓰레드 좋아요
const likeThread = async(req,res)=>{
  const threadId = req.params.threadId;
  const token = req.headers.authorization;

  try{
    //유효성 검사 해보자
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId = id.id;
    
    //이미 좋아요 했는지 확인단계
    const existingLike= await appDataSource.query(`
    SELECT id FROM thread_Likes
    WHERE user_id = ${userId} AND thread_id = ${threadId};
    `);
    //이미 좋아요 했을때  
    if(existingLike.length > 0){
      return res.status(400).json({"message":"이미 좋아요를 했습니다."});
    }

    //좋아요 테이블에 데이터 추가해주자
    await appDataSource.query(`
      INSERT INTO thread_likes (
        user_id,
        thread_id,
        created_at
      ) VALUES (
        '${userId}',
        '${threadId}',
        NOW()
      );
    `);

    return res.status(200).json({ message: "THREAD_LIKE_SUCCESS" });

  } catch(err){
    //토큰 값이 틀린 경우
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    }

    return res.status(500).json({ message: "오류가 발생했습니다!" });
  };
};

//쓰레드 좋아요 취소
const unlikeThread = async(req,res)=>{
  const threadId = req.params.threadId;
  const token = req.headers.authorization;
  try{
    //토큰 유효성 검사.
    const id = jwt.verify(token, process.env.SECRET_KEY);
    const userId = id.id;

    //이미 눌렀는지 확인해보자
    const existingLike = await appDataSource.query(`
      SELECT id
      FROM thread_likes
      WHERE user_id = ${userId} AND thread_id = ${threadId};
    `);
    //좋아요 누르지 않은 게시물인 경우 오류 전달
    if (existingLike.length === 0) {
      return res.status(400).json({ message: "아직 좋아요를 하지 않았습니다." });
    };

    // 좋아요 취소
    await appDataSource.query(`
      DELETE FROM thread_likes
      WHERE user_id=${userId} AND thread_id = ${threadId}
    `)
    return res.status(200).json({ message: "CANCEL_LIKE_SUCCESS" });

  }catch(err){
    //토큰 값이 틀린 경우
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "잘못된 토큰입니다." });
    }
    return res.status(500).json({ message: "오류가 발생했습니다!" });
  };



};
  //함수 내보내주자
  module.exports = {
    getThread,
    createThread,
    showThread,
    updateThread,
    commentThread,
    likeThread,
    unlikeThread,
    deleteThread
    };
