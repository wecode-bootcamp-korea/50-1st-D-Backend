const { DataSource } = require('typeorm')
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


//like
const userLike = async (req, res) => {
    const ti = req.body.id
    const userLikeClick1 = req.body.user_id
    const likesNumber1 = req.body.id


    const userLikeUp = await appDataSource.query(`
    INSERT INTO thread_likes (id, user_id, thread_id) 
    VALUES ('${ti}', '${userLikeClick1}','${likesNumber1}')`)

    console.log('typeorm return data: ', userLikeUp)

    return res.status(201).json({ message: 'likeCreated' })
}





appDataSource.initialize()

module.exports = { userLike };