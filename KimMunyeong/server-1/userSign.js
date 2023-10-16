const {DataSource} = require('typeorm')
const dotenv = require('dotenv');
dotenv.config();

const appDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})



const signUp = async (req, res) => {
    
    const userNickName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password

    const userData = await appDataSource.query(`
    INSERT INTO users (
        nickname,
        email,
        password
    )
    VALUES (
        '${userNickName}',
        '${userEmail}',
        '${userPassword}'
    )
    `)
    
    // const user = await appDataSource.query(`
    //     SELECT * from users
    // `)
    console.log('typeorm return data: ', userData)

    return res.status(201).json({ message: 'userCreated'})

}

appDataSource.initialize()



module.exports = { signUp };

