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


const threadsContent = async (req, res) => {

    //const threadsId = req.body.id
    const userIdNumber = req.body.user_id;
    const userContent = req.body.content;


    const userContents = await appDataSource.query(`
    INSERT INTO threads (
        user_id,
        content
    )
    VALUES (
        '${userIdNumber}',
        '${userContent}'
    )
    `)

    console.log('typeorm return data: ', userContents)

    return res.status(201).json({ message: 'success' })
}



appDataSource.initialize()



module.exports = { threadsContent };