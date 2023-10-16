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

const userAllContents = async (req, res) => {
    // const userIdNumber2 = req.body.id;
    // const userNickNAme2 = req.body.content;
    // const userProfileImage = req.body.profile_image;
    // const threadsIdNumber = req.body.id;
    // const threadsUserId = req.body.users_id;
    // const threadsContent2 = req.body.content;


    const uac = await appDataSource.query(`
    SELECT users.id, 
    users.nickname, 
    users.profile_image, 
    threads.id, 
    threads.user_id, 
    threads.content 
    FROM threads 
    INNER JOIN users ON threads.user_id = users.id
    `)

    //console.log('typeorm return data: ', uac)
   // console.log({userAllContents :'AsyncFunction: userAllContents]' })
    return res.status(200).json({ uac })
}


appDataSource.initialize()

module.exports = { userAllContents };