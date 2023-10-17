const { appDataSource } = require('./data');

const allContent = async (req, res) => {

    const userAll = await appDataSource.query(`
    SELECT users.id,
    users.nickname,
    users.profile_image,
    threads.id,
    threads.user_id,
    threads.content
    FROM threads
    INNER JOIN users ON threads.user_id = users.id
    `)

    console.log('typeorm return data: ', userAll)

    return res.status(200).json({ userAll })
}

module.exports = { allContent };