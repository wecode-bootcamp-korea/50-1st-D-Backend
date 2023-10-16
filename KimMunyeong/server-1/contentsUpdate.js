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


const userUpdate = async (req, res) => {

    const update1 = req.body.user_id
    //const update2 = req.body.nickname
    //const update3 = req.body.profile_image
    const update4 = req.body.id
    const update5 = req.body.content


    const dataUpdate = await appDataSource.query
    (`
    UPDATE threads 
    SET 
    content = '${update5}'
    WHERE 
    user_id = '${update1}' and id = '${update4}'
    `)

    console.log('typeorm return data: ', dataUpdate)
    return res.status(200).json({ dataUpdate })
}


appDataSource.initialize()

module.exports = { userUpdate };