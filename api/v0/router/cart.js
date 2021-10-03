const express = require('express');
const router = express.Router();

var Auth = require('../../../auth');
const Cart = require('../module/cart');

/**
 * Xem danh sách giỏ hàng
 * @permisstion có tài khoản
 * @body   
 * @returns     202
 */
router.get('/account', Auth.authenUser,async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let data = await Cart.selectAccount(id_account);

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
 * Thay đổi số lượng của sản phẩm trong giỏ hàng
 * @params        id_cart
 * @query         new_quantity
 * @returns         200, 415, 416, 423
 */
router.put('/update/:id_cart/quantity', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_cart = req.params.id_cart;
        let new_quantity = Number(req.query.new_quantity);
        let id_account = Auth.tokenData(req).id_account;

        if(new_quantity){
            if(new_quantity<1){
                return res.json({
                    code: 415
                })
            }

            let exist = await Cart.has(id_cart);

            if(!exist){
                return res.json({
                    code: 416
                })
            }

            let account = await Cart.selectID(id_cart);
            account = account.id_account;
            if(account != id_account){
                return res.sendStatus(403);
            }

            let update = await Cart.updateQuantity(id_cart, new_quantity);

            return res.json({
                code: 200
            })

        }else{
            return res.json({
                code: 423
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Thêm sản phẩm vô giỏ hàng
 * @params      id_product
 * @query       quantity
 * @returns     200, 201, 415
 */
router.post('/product/:id_product', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_product = req.params.id_product;
        let quantity = Number(req.query.quantity);
        let id_account = Auth.tokenData(req).id_account;

        if(quantity<1){
            return res.json({
                code: 415
            })
        }

        if(!quantity){
            quantity = 1;
        }

        let {exist, result} = await Cart.hasProductAccount(id_account, id_product);

        if(exist){
            let id_cart = result.id_cart;
            let add = await Cart.addQuantity(id_cart, quantity);
            return res.json({
                code: 200
            })
        }else{
            let add = await Cart.add(id_account, id_product, quantity);
            return res.json({
                code: 201
            })
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Xóa sản phẩm trong giỏ hàng
 * @params        id_cart
 */
router.delete('/product/:id_cart', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_cart = req.params.id_cart;
        let id_account = Auth.tokenData(req).id_account;
        if(!id_cart){
            return res.json({
                code: 400
            })
        }

        let exist = await Cart.has(id_cart);
        if(!exist){
            return res.json({
                code: 416
            })
        }

        let cart = await Cart.selectID(id_cart);
        if(cart.id_account != id_account){
            return res.json({
                code: 416
            })
        }

        let deleted = await Cart.delete(id_cart);
        return res.json({
            code: 200
        })
        
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

module.exports = router;