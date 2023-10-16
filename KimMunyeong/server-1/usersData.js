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

const userContentsData = async (req, res) => {
    //const userIdNumber2 = req.body.id;
    // const userProfileImage2 = req.body.profile_image;
    // const userC = req.body.content;
    // const userthreadsId = req.body.id;
    // const userThreadsContents = req.body.content;

    const ucd = await appDataSource.query(`
    SELECT 
    users.id, 
    users.profile_image, 
    threads.id, 
    threads.user_id,
    threads.content 
    FROM users 
    INNER JOIN threads ON users.id = threads.user_id
    `)

    console.log('typeorm return data: ', ucd)
   // console.log({userAllContents :'AsyncFunction: userAllContents]' })
    return res.status(200).json({ ucd })
}

appDataSource.initialize()

module.exports = { userContentsData };