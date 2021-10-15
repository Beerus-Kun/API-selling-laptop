const express = require('express');
const router = express.Router();

var Auth = require('../../../auth');
const Bill = require('../module/bill');
const Cart = require('../module/cart');
const Account = require('../module/account');
const Inventory = require('../module/inventory');
const Product = require('../module/product');
const Datetime = require('../module/date');

/**
 * Xem danh sách hóa đơn
 * @permission  co tai khoan
 * @body    page, num_rows
 * @return  202
 */
router.get('/account', Auth.authenUser, async(req, res, next)=>{
    try{
        let page = Number(req.body.page);
        let num_rows = Number(req.body.num_rows);
        let id_account = Auth.tokenData(req).id_account;
        if(!page){
            page = 1;
        }
        if(!num_rows){
            num_rows = 10;
        }

        let data = await Bill.selectAccount(id_account, page, num_rows);
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
 * Số lượng hóa đơn của 1 tài khoản
 * @permission  co tai khoan
 * @return      208
 */
router.get('/account/amount', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let amount = await Bill.selectAmountAccount(id_account);

        return res.json({
            code: 208,
            amount: amount
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Thông tin chi tiết của hóa đơn
 * @permission  co tai khoan
 * @params    id_bill
 * @returns     210, 424
 */
router.get('/information/:id_bill', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_bill = req.params.id_bill;
        let id_account = Auth.tokenData(req).id_account;
        let exist = await Bill.has(id_bill);
        if(!exist){
            return res.json({
                code: 424
            })
        }

        let real_account = await Bill.selectIdAccount(id_bill);

        if(real_account == id_account){
            let items = await Bill.selectItems(id_bill);
            let bill = await Bill.selectBill(id_bill);
            return res.json({
                code: 210,
                bill: bill,
                items: items
            })
        }else{
            return res.sendStatus(403);
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Xuất hóa đơn trong ngày
 * @permission  admin
 * @body    page, day, month, year, num_rows
 * @returns     202
 */
router.get('/day', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let page = Number(req.body.page);
        let num_rows = Number(req.body.num_rows);
        let day = Number(req.body.day);
        let month = Number(req.body.month);
        let year = req.body.year;

        if(!page){
            page = 1;
        }

        if(!num_rows){
            num_rows = 10;
        }

        if(!day){
            day = await Datetime.selectCurrentDay();
        }

        if(!month){
            month = await Datetime.selectCurrentMonth();
        }

        if(!year){
            year = await Datetime.selectCurrentYear();
        }

        if(day<10){
            day = '0'+ day;
        }

        if(month<10){
            month = '0' + month;
        }

        let date = year + '-'+ month + '-' + day;
        let data = await Bill.selectAllDay(date, page, num_rows);
        
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
 * Số lượng hóa đơn trong ngày
 * @permission  admin
 * @body     day, month, year
 * @returns     208
 */
router.get('/day/amount', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let day = Number(req.body.day);
        let month = Number(req.body.month);
        let year = req.body.year;

        if(!day){
            day = await Datetime.selectCurrentDay();
        }

        if(!month){
            month = await Datetime.selectCurrentMonth();
        }

        if(!year){
            year = await Datetime.selectCurrentYear();
        }

        if(day<10){
            day = '0'+ day;
        }

        if(month<10){
            month = '0' + month;
        }

        let date = year + '-'+ month + '-' + day;
        let amount = await Bill.selectAmountAllDay(date);

        return res.json({
            code: 208,
            amount: amount
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Doanh thu trong ngày
 * @permission  admin
 * @body     day, month, year
 * @returns     211
 */
router.get('/day/total', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let day = Number(req.body.day);
        let month = Number(req.body.month);
        let year = req.body.year;

        if(!day){
            day = await Datetime.selectCurrentDay();
        }

        if(!month){
            month = await Datetime.selectCurrentMonth();
        }

        if(!year){
            year = await Datetime.selectCurrentYear();
        }

        if(day<10){
            day = '0'+ day;
        }

        if(month<10){
            month = '0' + month;
        }

        let date = year + '-'+ month + '-' + day;
        let total = await Bill.selectTotalAllDay(date);

        return res.json({
            code: 211,
            total: total
        })
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Doanh thu trong tháng
 * @permission  admin
 * @body     month, year
 * @returns     202
 */
router.get('/month', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let month = Number(req.body.month);
        let year = Number(req.body.year);
        let data = [];

        if(!month){
            month = await Datetime.selectCurrentMonth();
        }

        if(!year){
            year = await Datetime.selectCurrentYear();
        }

        let days = daysInMonth(month, year);

        if(month<10){
            month = '0' + month;
        }

        for(let day = 1; day<=days ; day++){
            let daytxt = day;
            if(day<10){
                daytxt = '0' + day;
            }
            let date = year + '-'+ month + '-' + daytxt;
            let format_date = daytxt+'/'+month+'/'+year;
            let total = await Bill.selectTotalAllDay(date);
            let eachDay = {date: format_date, total: total};
            data.push(eachDay);
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
 * Kiểm tra đơn hàng trước khi mua
 * @permission  ng co tai khoan
 * @returns     207, 419, 417, 418
 */
router.get('/checked', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let acc = await Account.selectID(id_account);
        if(acc.status == 0){
            return res.json({
                code: 417
            })
        }

        let hasCart = await Cart.hasAccount(id_account);
        if(!hasCart){
            return res.json({
                code: 418
            })
        }

        let listProduct = await Cart.selectAccount(id_account);
        let totalPrice = 0;

        for(let i in listProduct){
            let existProduct = await Product.has(listProduct[0].id_product);
            if(!existProduct){
                return res.json({
                    code: 420,
                    name: listProduct[i].name
                })
            }else{
                let amount = await Inventory.selectAmount(listProduct[i].id_product);
                if(listProduct[i].quantity > amount){
                    return res.json({
                        code: 419,
                        id_product: listProduct[i].id_product,
                        product_name: listProduct[i].name,
                        amount: amount
                    })
                }
            }
            let product_price = listProduct[i].quantity * listProduct[i].current_price;
            listProduct[i]["product_price"] = product_price;
            totalPrice += product_price;
        }

        return res.json({
            code:207,
            data: listProduct,
            totalPrice: totalPrice,
            address: acc.address
        })

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Khách mua hàng
 * @permission  ng co tai khoan
 * @body     address
 * @returns     200, 417, 418, 419, 420
 */
router.post('/bought', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let address = req.body.address;
        let acc = await Account.selectID(id_account);
        
        if(acc.status == 0){
            return res.json({
                code: 417
            })
        }

        if(!address){
            address = acc.address;
        }
        
        let hasCart = await Cart.hasAccount(id_account);
        if(!hasCart){
            return res.json({
                code: 418
            })
        }
        let sold_out = [];
        let listProduct = await Cart.selectAccount(id_account);
        for(let i in listProduct){
            let existProduct = await Product.has(listProduct[0].id_product);
            if(!existProduct){
                return res.json({
                    code: 420,
                    name: listProduct[i].name
                })
            }else{
                let amount = await Inventory.selectAmount(listProduct[i].id_product);
                if(listProduct[i].quantity > amount){
                    return res.json({
                        code: 419,
                        product_name: listProduct[i].name,
                        amount: amount
                    })
                }else if(listProduct[i].quantity == amount){
                    sold_out.push(listProduct[i].id_product);
                }
            }
        }

        let id_bill = await Bill.addBill(id_account, address);
        
        for(let id_product of sold_out){
            let update_status = await Product.updateStatus(id_product, 0);
        }

        for(let i in listProduct){
            let update_inventory = await Inventory.updateSold(listProduct[i].id_product, listProduct[i].quantity);
            let price = await Product.selectCurrentPrice(listProduct[i].id_product);
            price = price * listProduct[i].quantity;
            let addItem = await Bill.addItem(id_bill, listProduct[i].id_product, listProduct[i].quantity, price, listProduct[i].warranty);
        }
        
        let update = await Bill.updateTotal(id_bill);
        let deletedCart = await Cart.deleteAccount(id_account);

        autoChangeStatus(id_bill);
        res.json({
            code: 200
        })

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Khách mua hàng
 * @permission  ng co tai khoan
 * @params      id_bill
 * @returns     200, 417, 424, 425
 */
router.put('/cancel/:id_bill', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let acc = await Account.selectID(id_account);
        let id_bill = req.params.id_bill;

        if(acc.status == 0){
            return res.json({
                code: 417
            })
        }

        let exist = await Bill.has(id_bill);

        if(!exist){
            return res.json({
                code: 424
            })
        }

        let real_account = await Bill.selectIdAccount(id_bill);

        if(real_account != id_account){
            return res.sendStatus(403);
        }else{
            let bill = await Bill.selectBill(id_bill);
            if(bill.status == 1){
                let listItems = await Bill.selectItems(id_bill);
                for(let item of listItems){
                    let update_inventory = await Inventory.updateSold(item.id_product,-1 * item.quantity);
                }

                let update_status = await Bill.updateStatus(id_bill, 0);
                return res.json({
                    code: 200
                })
            }else{
                return res.json({
                    code: 425
                })
            }
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

async function updateStatusShip(id_bill){
    let status = await Bill.selectStatusID(id_bill);
    if(status == 1){
        let update = await Bill.updateStatus(id_bill, 2);
    }
}

async function updateStatusSold(id_bill){
    let status = await Bill.selectStatusID(id_bill);
    if(status == 2){
        let update = await Bill.updateStatus(id_bill, 3);
    }
}

function autoChangeStatus(id_bill){
    // let timeShip = 2*60*1000;
    // let timeSold = timeShip + 60*1000;

    let timeShip = 60*1000;
    let timeSold = timeShip + 60*1000;

    setTimeout(updateStatusShip, timeShip, id_bill);
    setTimeout(updateStatusSold, timeSold, id_bill);

}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = router;