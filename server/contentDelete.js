const { appDataSource } = require('./data');

const deleteContent = async (req, res) => {

    const userId = req.body.user_id

    const threadDelete = await appDataSource.query(`
    DELETE FROM thread_comments
    WHERE user_id = '${userId}'
    `)

    console.log('typeorm return data: ', threadDelete)

    return res.status(200).json({ "message": "contentDeleted" })
}

module.exports = { deleteContent };