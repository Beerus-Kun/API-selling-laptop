const bcrypt = require('bcrypt');
const saltRounds = 10;

const security = {}

security.encrypt = async (password)=>{
    bcrypt.hash(password, saltRounds, async(err, hash)=>{
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        else{
            return hash;
        }
    })
}

security.compare = async (check, saved)=>{
    return bcrypt.compare(check, saved);
}

module.exports = security;