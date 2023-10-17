const { appDataSource } = require('./data');

const threadsContent = async (req, res) => {

    //const threadsId = req.params.threadsId
    const usersId = req.body.user_id
    const contentsAdd = req.body.content

    const threadsContentAdd = await appDataSource.query(`
    INSERT INTO threads ( 
        user_id, 
        content
    ) VALUES (
        '${usersId}', 
        '${contentsAdd}'
    )
    `)
    
    console.log('typeorm return data: ', threadsContentAdd)

    return res.status(201).json({"message": "contentCreated"})
}

module.exports = { threadsContent };