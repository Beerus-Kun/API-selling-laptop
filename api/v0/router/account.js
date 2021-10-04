const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Mailer = require('../../../mail');
const router = express.Router();
const Account = require('../module/account');
const Verification = require('../module/verification');
var Auth = require('../../../auth');


/**
 * Đăng nhập 
 * @body        email, password
 * @returns     400, 203, 401
 */
router.post('/login', async(req, res, next)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;

        if(!(email && password)){
            return res.json({
                code: 400
            })
        }

        let exist = await Account.hasEmail(email);

        if(exist){
            let real_pass = await Account.selectPassword(email);
            let match = await bcrypt.compare(password, real_pass);

            if(match){
                let acc = await Account.selectEmail(email);
                var data = {
                    "id_account": acc.id_account,
                    "position": acc.position,
                    "email": acc.email,
                    "status": acc.status,
                }
                        
                const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});

                return res.json({
                    code : 203,
                    accessToken : accessToken
                });
            }else{
                return res.json({
                    code: 401
                });
            }
        }else{
            return res.json({
                code: 401
            });
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Đăng nhập quản lý
 * @body        email, password
 * @returns     400, 401, 203
 */
router.post('/login/personel', async(req, res, next)=>{
    try{
        let email = req.body.email;
        let password = req.body.password;

        if(!(email && password)){
            return res.json({
                code: 400
            })
        }

        let exist = await Account.hasEmail(email);
        if(!exist){
            return res.json({
                code: 401
            })
        }

        let position = await Account.selectPositionEmail(email);
        if(position==0){
            return res.json({
                code: 401
            })
        }

        let real_pass = await Account.selectPassword(email);
        let match = await bcrypt.compare(password, real_pass);

        if(match){
            let acc = await Account.selectEmail(email);
            var data = {
                "id_account": acc.id_account,
                "position": acc.position,
                "email": acc.email,
                "status": acc.status,
            }
                    
            const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});

            return res.json({
                code : 203,
                accessToken : accessToken
            });
        }else{
            return res.json({
                code: 401
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Thêm 1 tài khoản thường
 * 
 * @permisson   Ai cũng có thể thực thi
 * @body        email, name, password, sex, phone, address
 * @returns     201, 400, 421
 */
router.post('/signup', async (req, res, next) => {
    try {
        let email = req.body.email;
        let name = req.body.name;
        let password = req.body.password;
        let sex = req.body.sex;
        let phone = req.body.phone;
        let address = req.body.address;

        if (email && name && password && phone && address) {
            if(password.trim() == ""){
                return res.json({
                    code: 400
                })
            }

            let existEmail = await Account.hasEmail(email);
            if(existEmail){
                return res.json({
                    code: 421
                })
            }

            bcrypt.hash(password, saltRounds, async(err, hash)=>{
                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                else{
                    password = hash;
                    let position = 0;
                    let insertId = await Account.add(email, password, name, phone, address, sex, position);
                    return res.json({
                        code: 201
                    });
                }
            })
        } else {
            res.json({
                code: 400
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Something wrong'
        })
    }

});

/**
 * Tạo tài khoản stocker
 * @params      
 * 
 * @body        account_name, real_name, email, password 
 * @permisson   Chỉ có quan ly
 * @returns     201, 400, 421
 */
 router.post('/create/stocker', Auth.authenAdmin, async (req, res, next) => {
    try {
        let email = req.body.email;
        let name = req.body.name;
        let password = req.body.password;
        let sex = req.body.sex;
        let phone = req.body.phone;
        let address = req.body.address;

        if (email && name && password && phone && address) {
            if(password.trim() == ""){
                return res.json({
                    code: 400
                })
            }

            let existEmail = await Account.hasEmail(email);
            if(existEmail){
                return res.json({
                    code: 421
                })
            }

            else{
                bcrypt.hash(password, saltRounds, async(err, hash)=>{
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    else{
                        password = hash;
                        let position = 1;
                        let insertId = await Account.add(email, password, name, phone, address, sex, position);
                        return res.json({
                            code: 201
                        });
                    }
                })
                
            }
            
        } else {
            res.json({
                code: 400
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Something wrong'
        })
    }

});

/**
 * Tạo tài khoản admin
 * @params      
 * 
 * @body        account_name, real_name, email, password 
 * @permisson   Chỉ có quan ly
 * @returns     201, 400, 421
 */
 router.post('/create/admin', Auth.authenAdmin, async (req, res, next) => {
    try {
        let email = req.body.email;
        let name = req.body.name;
        let password = req.body.password;
        let sex = req.body.sex;
        let phone = req.body.phone;
        let address = req.body.address;

        if (email && name && password && phone && address) {
            if(password.trim() == ""){
                return res.json({
                    code: 400
                })
            }else{
                let existEmail = await Account.hasEmail(email);
                if(existEmail){
                    return res.json({
                        code: 421
                    })
                }

                bcrypt.hash(password, saltRounds, async(err, hash)=>{
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    else{
                        password = hash;
                        let position = 2;
                        let insertId = await Account.add(email, password, name, phone, address, sex, position);
                        return res.json({
                            code: 201
                        });
                    }
                })
                
            }
        } else {
            res.json({
                code: 400
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Something wrong'
        })
    }

});

/**
 * Tạo tài khoản admin khởi đầu    
 * @body        account_name, real_name, email, password 
 * @returns     201, 400, 402
 * 
 */
 router.post('/create/admin/init', async (req, res, next) => {
    try {
        let email = req.body.email;
        let name = req.body.name;
        let password = req.body.password;
        let sex = req.body.sex;
        let phone = req.body.phone;
        let address = req.body.address;
        let hasAdmin = await Account.hasAdmin();

        if(hasAdmin){
            return res.json({
                code:402
            })
        }
        
        if (email && name && password && phone && address) {
            if(password.trim() == ""){
                return res.json({
                    code: 400
                })
            }
            else{
                bcrypt.hash(password, saltRounds, async(err, hash)=>{
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    else{
                        password = hash;
                        let position = 2;
                        let insertId = await Account.add(email, password, name, phone, address, sex, position);

                        return res.json({
                            code: 201
                        });
                    }
                })
            }
        } else {
            res.json({
                code: 400
            })
        }
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }

});

/**
 * Lấy thông tin tài khoản của mình
 * 
 * @permission  những người đã đăng nhập vào tài khoản
 * @returns     202
 */
router.get('/information', Auth.authenUser, async (req, res, next) => {
    try {

        let result = await Account.selectID(Auth.tokenData(req).id_account);

        res.json({
            code: 202,
            data: result
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Something wrong!'
        })
    }
})

/**
 * Đổi password của cá nhân
 * @body        new_password
 * @permisson   Ai cũng có thể thực thi
 * @returns     200, 400
 */
router.put('/change_password', Auth.authenUser, async(req, res, next)=>{
    try{
        let new_password = req.body.new_password;
        let id_account = Auth.tokenData(req).id_account;

        if(new_password.trim()!=""){
            bcrypt.hash(new_password, saltRounds, async(err, hash)=>{
                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                else{
                    new_password = hash;
                    let changePassword = await Account.updatePassword(id_account, new_password);
                    return res.json({
                        code: 200
                    })
                }
            })

            
        }else{
            return res.json({
                code: 400
            });
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * Quên mật khẩu
 * @body        email
 * 
 * @permisson   Ai cũng có thể thực thi
 * 
 * @return      400, 204
 */
router.post('/forgot-password', async(req, res, next)=>{
    try{
        let email = req.body.email;

        if(!email){
            return res.json({
                code: 400
            });
        }

        let exist = await Account.hasEmail(email);
        if(exist){
            let code = await createCode();
            
            bcrypt.hash(code, saltRounds, async(err, hash)=>{
                if(err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                else{
                    let acc = await Account.selectEmail(email);
                    let send = Mailer.sendVerification(email, code);
                    code = hash;
                    let id_verify = await Verification.add(acc.id_account, code);
                    let del = autoDeleteCode(id_verify);
                    res.json({
                        code: 204,
                        id_account: acc.id_account
                    })
                }
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Xác nhận mã (mã có hiệu lực trong 60s)
 * @params      id_account
 * @body        code
 * @permisson   Ai cũng có thể thực thi
 * @returns     203, 400, 405
 */
router.post('/confirm/:id_account', async(req, res, next)=>{
    try{
        let code = req.body.code;
        let id_account = req.params.id_account;

        if(!code || !id_account){
            return res.json({
                code: 400
            })
        }

        let exist = await Verification.hasAccount(id_account);
        if(!exist){
            return res.json({
                code: 405
            })
        }

        let verify = await Verification.selectCode(id_account);
        let match = await bcrypt.compare(code, verify);
        // let match = await bcrypt.compare(code, verify);
        if(match){
            let acc = await Account.selectID(id_account);
            var data = {
                "id_account": acc.id_account,
                "position": acc.position,
                "email": acc.email,
                "status": acc.status,
            }
                    
            const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000s'});

            return res.json({
                code: 203,
                accessToken: accessToken
            });
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Lấy danh sách tất cả tài khoản
 * @query       page, num_rows
 * @permission chỉ quản lý
 * @returns     202
 */
router.get('/all', Auth.authenAdmin, async (req, res, next) => {
    page = Number(req.query.page);
    num_rows = Number(req.query.num_rows);
    if(!page){
        page = 1;
    }

    if(!num_rows){
        num_rows = 10;
    }

    var list = await Account.selectAll(page,num_rows);

    return res.json({
        code: 202,
        data: list
    });
});

/**
 * Lấy số lượng tài khoản
 * 
 * @permission chỉ quản lý
 * @returns     202
 */
 router.get('/all/amount', Auth.authenAdmin, async (req, res, next) => {
    var data = await Account.selectAmountAll();

    return res.json({
        code: 208,
        amount: data
    });
});

/**
 * Lấy danh sách tất cả tài khoản bị khóa
 * 
 * @permission chỉ quản lý
 * @query       page, num_rows
 * @returns     202
 */
 router.get('/lock', Auth.authenAdmin, async (req, res, next) => {
    page = Number(req.query.page);
    num_rows = Number(req.query.num_rows);
    if(!page){
        page = 1;
    }
    if(!num_rows){
        num_rows = 10;
    }

    var list = await Account.selectAllLock(page, num_rows);
    
    return res.json({
        code: 202,
        data: list
    });
});

/**
 * Lấy số lượng tài khoản bị khóa
 * 
 * @permission chỉ quản lý
 * @returns     208
 */
 router.get('/lock/amount', Auth.authenAdmin, async (req, res, next) => {
    var amount = await Account.selectAmountLock();

    return res.json({
        code: 208,
        amount: amount
    });
});

/**
 * Tìm kiếm theo email
 * @query        search, page, num_rows
 * @permission chỉ quản lý
 * @returns     202, 400
 */
router.get("/search", Auth.authenAdmin, async(req, res, next)=>{
    try{
        let search = req.query.search;
        let page = Number(req.query.page);
        let num_rows = Number(req.query.num_rows);
        if(!search){
            return res.json({
                code: 423
            })
        }

        if(!page){
            page = 1;
        }

        if(!num_rows){
            num_rows = 10;
        }

        let data = await Account.selectSearch(search, page);

        return res.json({
            code: 202,
            data: data
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500)
    }
})

/**
 * Số lượng kết quả tìm theo email
 * @query        search
 * @permission chỉ quản lý
 * @returns     208, 400
 */
 router.get("/search/amount", Auth.authenAdmin, async(req, res, next)=>{
    try{
        let search = req.query.search;
        if(!search){
            return res.json({
                code: 423
            })
        }

        let data = await Account.selectAmountSearch(search);

        return res.json({
            code: 208,
            amount: data
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500)
    }
})

/**
 * Khóa tài khoản
 * @params      id_account
 * @permisson   Chỉ có admin
 * @returns     200, 403, 404
 */
 router.put('/lock/:id_account', Auth.authenAdmin, async (req, res, next)=>{
    try{
        let id_account_lock = req.params.id_account;

        let exist = await Account.hasId(id_account_lock);
        if(!exist){
            return res.json({
                code: 404
            });
        }

        let position = await Account.selectPosition(id_account_lock);
        if(position!=0){
            return res.json({
                code: 403
            })
        }else{
            let lock = Account.updateStatus(id_account_lock, 0);
            return res.json({
                code: 200
            });
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * Mở khóa tài khoản
 * @params      id_account
 * @permisson   Chỉ có admin
 * @returns     200, 404
 * 
 */
 router.put('/unlock/:id_account', Auth.authenAdmin, async (req, res, next)=>{
    try{
        let id_account_lock = req.params.id_account;

        let exist = Account.hasId(id_account_lock);
        if(!exist){
            return res.json({
                code: 404
            });
        }

        let lock = Account.updateStatus(id_account_lock, 1);
        res.json({
            code: 200
        });


    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

/**
 * cập nhật thông tin tài khoản
 * @body        name, phone, address, sex
 * @permission  phải đăng nhập thì mới được thực thi (user trở lên)
 */
 router.put('/update/information', Auth.authenUser, async (req, res, next) => {
    try {
        let id_account = Auth.tokenData(req).id_account;
        let name = req.body.name;
        let phone = req.body.phone;
        let address = req.body.address;
        let sex = req.body.sex;

        if(name && phone && address){
            let update = await Account.update(id_account, name, phone, address, sex);
            return res.json({
                code:200
            })
        }else{
            return res.json({
                code:400
            })
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Something wrong'
        })
    }

})

function deleteCode(id_verification){
    let del = Verification.delete(id_verification);
}

function autoDeleteCode(id_verification){
    setTimeout(deleteCode, 60000, id_verification);
}

async function createCode() {
    var result = '';
    for ( var i = 0; i < 6; i++ ) {
        result += String(Math.floor(Math.random() * 10));
    }
    return result;
}


module.exports = router;