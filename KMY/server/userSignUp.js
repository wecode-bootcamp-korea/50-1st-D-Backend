const { appDataSource } = require('./data');

const signUp = async (req, res) => {

    const userNickName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password

    const userAdd = await appDataSource.query(`
    INSERT INTO users (
        nickname, 
        email, 
        password
    ) VALUES (
        '${userNickName}', 
        '${userEmail}', 
        '${userPassword}'
    )
    `)
    
    console.log('typeorm return data: ', userAdd)

    return res.status(201).json({"message": "userCreated"})
}

module.exports = { signUp };