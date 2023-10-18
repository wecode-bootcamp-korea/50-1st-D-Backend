const { appDataSource } = require('../app');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();


//회원가입을 만들어보자
const signUp = async(req, res) => {
  const userNickname = req.body.nickname;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userphoneNumber=req.body.phone_number;
  const userBirthday = req.body.birth_day;
  const profileImage = "https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffc7a0770-8294-4680-9cb3-c81efe407127%2Fb5f725e6-ab7c-44cc-ad87-1214e26017a9%2FUntitled.jpeg?table=block&id=9589c573-1bbb-48d7-a06b-a0502555d9cd&spaceId=fc7a0770-8294-4680-9cb3-c81efe407127&width=2000&userId=3389c2f0-8e40-4e50-a5a8-1876a4ee6b79&cache=v2"
 
  //필수 입력 정보 누락 확인
  // if (!userNickname ||  !userEmail || !userPassword) {
  //   const error = new Error("KEY_ERROR");
  //   error.statusCode = 400;
  //   throw error; 
  // };
  
  if (!userNickname ||  !userEmail || !userPassword) {
    res.status(400).json({ error: "All fields must be filled." });
    return;
  };

  //이메일 정규화
  const emailScanning = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const checkEmail = userEmail.match(emailScanning);
  // if(!checkEmail){
  //   const error = new Error("Stranged e-mail, please check it.");
  //   error.status = 400;
  //   throw error;
  // };
  if(!checkEmail){
    res.status(400).json({ error: "Stranged e-mail, please check it." });
    return;
  };

  //비밀번호 암호화
  const saltRounds = 12;
  const hashedPw = await bcrypt.hash(userPassword, saltRounds);


  //데이터베이스로 저장
  const userData = await appDataSource.query(`
    INSERT INTO users (
      nickname,
      email,
      password,
      phone_number,
      birth_day,
      profile_image
    )
    VALUES (
      '${userNickname}',
      '${userEmail}', 
      '${hashedPw}',
      '${userphoneNumber}',
      '${userBirthday}',
      '${profileImage}'
    )
  `)
  // 1-3. DB에 저장되었는지 확인하기
  console.log("TYPEORM RETURN DATA: ", userData)

  // 1-4. front 에게 저장이 잘 되었다는 소식을 보내기
  return res.status(201).json({"message": "SIGNUP_SUCCESS"})
};
//로그인을 만들어보자
const login = async(req,res) => {
  
  try{
    const email = req.body.email;
    const password = req.body.password;

    //입력안했을때 에러코드
    if (!email||!password){  
    res.status(400).json({ error: "Invalid attempt."});
    return;
    };

    //Email로 해당 유저가 존재하는지 확인해보자
    const userEmail = await appDataSource.query(`
      SELECT id,email,password
      FROM users
      WHERE email = '${email}';
    `)

    //email이 없는 유재로 존재할때
    if (userEmail.length===0){
      res.status(400).json({ error: "E-mail doesn't exist."});
      return;
    };
    
    console.log(userEmail[0]);
    
    //DB에 저장된 비밀번호와 비교
    const hashPw = await bcrypt.compare(password, userEmail[0].password);

    //일치하지 않는 경우
    if(!hashPw){
      res.status(400).json({ error: "Entered password is not valid."});
      return;
    };

    //토큰을 전달해보자
    // const userId = userEmail[0].id;
    const token =jwt.sign({"id":userEmail[0].id},process.env.SECRET_KEY);

    //성공 전달
    return res.status(200).json({
      "message":"로그인 성공",
      "userToken": token
    });

  } catch (err) { 
    return res.status(400).json({ error: "오류가 발생했어"});

  }
};
//전송해주기 옆 파일로
module.exports = {
  signUp,
  login
};