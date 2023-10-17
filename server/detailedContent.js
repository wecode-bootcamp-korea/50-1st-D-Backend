const { appDataSource } = require('./data');

const detailContent = async (req, res) => {

    //const userID = req.body.nickname;

    const detailAll = await appDataSource.query(`
    SELECT users.id,
    users.nickname, 
    users.profile_image, 
    thread_comments.user_id,
    thread_comments.content
    FROM users, threads, thread_comments 
    WHERE users.id = threads.user_id
    AND threads.user_id = thread_comments.user_id
    `)

    console.log('typeorm return data: ', detailAll)

    return res.status(200).json({ detailAll })
}

module.exports = { detailContent };