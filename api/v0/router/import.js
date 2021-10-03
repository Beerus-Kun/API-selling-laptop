const express = require('express');
const router = express.Router();

var Auth = require('../../../auth');
const Import = require('../module/import');
const Inventory = require('../module/inventory');
const Product = require('../module/product'); 
const Datetime = require('../module/date');


/**
 * Xem danh sách tất cả nhập hàng
 * @permision   người làm việc
 * @query   page, num_rows, 
 *          is_date, day, month, year,
 *          is_product, id_product
 * @returns 202, 423
 */
router.get('/all', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let page = Number(req.query.page);
        let num_rows = Number(req.query.num_rows);
        let is_date = req.query.is_date;
        let day = req.query.day;
        let month = req.query.month;
        let year = req.query.year;
        let is_product = req.query.is_product;
        let id_product = req.query.id_product;

        let data;

        if(!num_rows){
            num_rows = 10;
        }
        if(!page){
            page = 1;
        }

        if(is_date == 1){
            if(!day){
                day = await Datetime.selectCurrentDay();
            }

            if(!month){
                month = await Datetime.selectCurrentMonth();
            }

            if(!year){
                year = await Datetime.selectCurrentYear();
            }

            if(Number(day)<10){
                day = '0'+ day;
            }

            if(Number(month)<10){
                month = '0' + month;
            }

            let date = year + '-' + month + '-' + day;
            console.log(date);
            data = await Import.selectDay(date, page, num_rows);
        }else if(is_product == 1){
            if(!id_product){
                return res.json({
                    code: 423
                })
            }else{
                data = await Import.selectProduct(id_product, page, num_rows);
            }
        }else{
            data = await Import.selectAll(page, num_rows);
        }

        return res.json({
            code: 202,
            data: data
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Xem số lượng hàng nhập
 * @permission  người làm việc
 * @query       is_date, day, month, year,
 *              is_product, id_product
 * @returns     208, 423
 */
router.get('/all/amount', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let is_date = req.query.is_date;
        let day = req.query.day;
        let month = req.query.month;
        let year = req.query.year;
        let is_product = req.query.is_product;
        let id_product = req.query.id_product;

        let amount;
        if(is_date == 1){
            if(!day){
                day = await Datetime.selectCurrentDay();
            }

            if(!month){
                month = await Datetime.selectCurrentMonth();
            }

            if(!year){
                year = await Datetime.selectCurrentYear();
            }
            if(Number(day)<10){
                day = '0'+ day;
            }

            if(Number(month)<10){
                month = '0' + month;
            }
            let date = year+'-'+month+'-'+day;
            amount = await Import.selectAmountDay(date);
        }else if(is_product == 1){
            if(!id_product){
                return res.json({
                    code: 423
                })
            }else{
                amount = await Import.selectAmountProduct(id_product);
            }
        }else{
            amount = await Import.selectAmountAll();
        }

        return res.json({
            code: 202,
            amount: amount
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Lấy thông tin 1 import
 * @permission  người làm việc
 * @params      id_import
 * @returns     208, 413
 */
router.get('/information/:id_import', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let id_import = req.params.id_import;
        let exist = await Import.has(id_import);
        if(exist){
            let data = await Import.selectID(id_import);
            return res.json({
                code: 202,
                data: data
            })
        }else{
            return res.json({
                code: 413
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Thay đổi số lượng nhập
 * @permisstion stocker
 * @params      id_import
 * @body        new_quantity
 */
router.put('/change/:id_import', Auth.authenStocker, async(req, res, next)=>{
    try{
        let id_import = req.params.id_import;
        let new_quantity = Number(req.body.new_quantity);

        if(new_quantity){
            let exist = await Import.has(id_import);
            if(!exist){
                return res.json({
                    code: 413
                })
            }

            let imported = await Import.selectID(id_import);
            let id_product = imported.id_product;
            let amount = await Inventory.selectAmount(id_product);
            if((new_quantity - imported.quantity + amount) < 0){
                return res.json({
                    code: 414
                })
            }

            let update_inventory = await Inventory.updateAmount(id_product, (new_quantity - imported.quantity));
            let update_import = await Import.updateQuantity(id_import, new_quantity);

            return res.json({
                code:200
            })

        }else{
            return res.json({
                code: 400
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Nhập hàng
 * @body   id_product, quantity
 */
router.post('/', Auth.authenStocker, async(req, res, next)=>{
    try{
        let id_product = req.body.id_product;
        let quantity = Number(req.body.quantity);
        let id_account = Auth.tokenData(req).id_account;

        if(id_product && quantity){
            if(!isNumber(quantity) || quantity<0){
                return res.json({
                    code: 407
                })
            }
            let exist = await Product.has(id_product);
            if(!exist){
                return res.json({
                    code: 411
                })
            }

            let id_import = await Import.add(id_account, id_product, quantity);
            let update_inventory = await Inventory.updateAmount(id_product, quantity);
            let status = await Product.selectStatus(id_product);
            if(status == 0){
                let update_status = await Product.updateStatus(id_product, 1);
            }
            return res.json({
                code: 201
            })
        }else{
            return res.json({
                code: 400
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

// router.('/', async(req, res, next)=>{
//     try{

//     }catch(err){
//         console.log(err);
//         return res.sendStatus(500);
//     }
// })

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

module.exports = router;