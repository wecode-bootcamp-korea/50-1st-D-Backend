const { appDataSource } = require('./data');

const pushLike = async (req, res) => {

    //const likeId = req.body.id
    const userID = req.body.user_id
    const threadsId = req.body.thread_id

    const userLike = await appDataSource.query(`
    INSERT INTO thread_likes(
        user_id, 
        thread_id
    ) VALUES (
        '${userID}', 
        '${threadsId}'
    )
    `)

    console.log('typeorm return data: ', userLike)

    return res.status(200).json({ "message": "likeCreated" })
}

module.exports = { pushLike };