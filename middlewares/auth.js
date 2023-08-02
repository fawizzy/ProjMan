import redisClient from "../db/redis"

const auth = async (req, res)=>{
    try {
        const token = req.cookies.session_id
        const key = `auth_${token}`
        //const key = `auth_${req.params ? req.params.id : null}`;
        const id = await redisClient.get(key)
        if (!id){
            res.status(401).json({message: "unauthorized user"})
        }else{
            res.status(401).json({message: "authorized user"})
        }     
    } catch (error) {
        console.log(error)
        res.status(401).json({message: "unauthorized user"})
    }
}

module.exports = auth