module.exports = function (req, res, next)

{
    const password = "farida9898"
    if (password == req.body.password){
        return next()
    }else{
        return res.status(400).json({message : "NO THE ADMIN"})
    }
   
}