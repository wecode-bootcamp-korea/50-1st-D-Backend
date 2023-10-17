const { appDataSource } = require('./data');

const userUpdate = async (req, res) => {

    const threadsID = req.body.id
    const userID = req.body.user_id
    const contents = req.body.content

    //만약 그 게시물이 없다면
    const contentCheck = await appDataSource.query(`
        SELECT id, user_id, content
        FROM threads 
        WHERE id = '${threadsID}'
    `)
    if (contentCheck.length === 0) {
        return res.status(404).json({
            "message": "CONTNETS_NOT_FOUND"
        })
    }
    //console.log("eeeee: ", contentCheck)



    // //만약 그 사람이 없다면
    const userCheck = await appDataSource.query(`
        SELECT id, email
        FROM users 
        WHERE id = '${userID}'
    `)
    if (userCheck.length === 0) {
        return res.status(401).json({
            "message": "USER_NOT_FOUND"
        })
    }
    // console.log("message: ", userCheck)



    //만약 게시물의 작성자가 아니라면(판단)
    const contentUser = contentCheck[0].user_id
    const usersId = userCheck[0].id
    if (contentUser !== usersId) {
        return res.status(403).json({"message": "UNAUTHENTICATED"})
    }




    const dataUpdate = await appDataSource.query(`
        UPDATE threads
        SET 
        content = '${contents}'
        WHERE
        id = '${threadsID}'
        AND user_id = '${userID}'
    `)

    console.log('typeorm return data: ', dataUpdate)
    return res.status(200).json({
        "message": "CONTENT_UPDATED",
        "updateddata": { contents }
    })
}

module.exports = { userUpdate };