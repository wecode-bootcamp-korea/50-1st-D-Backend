const { appDataSource } = require('../app');
// 1. 회원가입 하는 함수 생성
const signUp = async(req, res) => {
  // 1-0. 호출되었는지 확인
  // 1-1. request body로부터 사용자 정보 꺼내기 (받아오기)
  const userName = req.body.name
  const userEmail = req.body.email
  const userPassword = req.body.password 

  // 1-2. email, password, name를 Database에 저장하기.
  // 1-2-1. typeorm 설치 후, appDataSource 만들어 두기!
  // 1-2-2. SQL문을 명령하기
  const userData = await appDataSource.query(`
    INSERT INTO users (
      name, 
      password,
      email
    )
    VALUES (
      '${userName}',
      '${userPassword}', 
      '${userEmail}'
    )
  `)
  // 1-3. DB에 저장되었는지 확인하기
  console.log("TYPEORM RETURN DATA: ", userData)

  // 1-4. front 에게 저장이 잘 되었다는 소식을 보내기
  return res.status(201).json({"message": "SIGNUP_SUCCESS"})
};

//전송해주기 옆 파일로
module.exports = {
  signUp
};