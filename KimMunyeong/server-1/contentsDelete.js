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

const userDelete = async (req, res) => {

    const delete1 = req.body.user_id
    const delete2 = req.body.content
    //const update2 = req.body.nickname
    //const update3 = req.body.profile_image
    // const update4 = req.body.id
    // const update5 = req.body.content


    const dataDelete = await appDataSource.query
    (`DELETE FROM threads WHERE user_id = '${delete1}' AND content = '${delete2}'`)

    console.log('typeorm return data: ', dataDelete)
    return res.status(200).json({ dataDelete })
}


appDataSource.initialize()

module.exports = { userDelete };