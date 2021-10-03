const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
var Auth = require('../../../auth');
var Image = require('../module/image');
var Validation = require('../../../validation');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
});

/**
 * @params      id_image
 * @returns     406
 * Lấy hình theo id
 */
router.get('/information/:id_image', async(req, res, next) => {
    try{
        let id_image = req.params.id_image;
        let has = await Image.has(id_image);

        if(!has){
            return res.json({
                code: 406
            })
        }else{
            let path = await Image.selectPath(id_image);
            let image = fs.readFile(path, (err, data)=>{
                if(err){
                    return res.sendStatus(500)
                }else{
                    res.status(200);
                    return res.end(data);
                }
            });
        }
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Xóa hình theo id_image
 * @permisson   admin
 * @params      id_image
 * @returns     205, 406
 */
router.delete('/:id_image', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let id_image = req.params.id_image;
        let exist = await Image.has(id_image);

        if(!exist){
            return res.json({
                code: 406
            })
        }

        let has = await Image.hasInProduct(id_image);
        if(has){
            return res.json({
                code: 422
            })
        }else{
            let path = await Image.selectPath(id_image);
            fs.unlinkSync(path);
            let del = await Image.delete(id_image);
            return res.json({
                code: 205
            })
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Đăng ảnh
 * @body        file hình
 * @permisson   admin
 * @return      206, 408
 */
router.post('/', Auth.authenAdmin, upload.single('image'), async (req, res, next) => {
    try{
        let file = req.file;
        
        if (!file) {
            return res.json({
                code: 408
            });
        }else{
            let id_image = await Image.add(file.path);
            return res.json({
                code: 209,
                id_image: id_image
            });
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Lấy tất cả hình
 * @permisson   Quản lý
 * @query       page, num_rows
 * @returns     202, 407
 */
router.get('/all', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let page = Number(req.query.page);
        let num_rows = Number(req.query.num_rows);

        if(!num_rows){
            num_rows = 10;
        }

        if(!page){
            page = 1;
        }

        if(!Validation.isNumber(page) || !Validation.isNumber(num_rows)){
            return res.json({
                code: 407
            });
        }else{
            let data = await Image.selectAll(num_rows, page);
            return res.json({
                code: 202,
                data: data
            })
        }      
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

/**
 * Lấy số lượng tất cả hình
 * @permisson   admin
 * @returns     208
 */
router.get('/all/amount', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let amount = await Image.selectAmountAll();

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
 * Đổi ảnh
 * @body        file ảnh
 * @permisson   admin
 * @params      id_image
 * @returns     200, 406, 408
 */
router.put('/change/:id_image', Auth.authenAdmin, upload.single('image'), async (req, res, next)=>{
    try{
        let id_image = req.params.id_image;
        let has = await Image.has(id_image);
        if(!has){
            return res.json({
                code: 406
            });
        }

        let file = req.file;
        if(!file){
            return res.json({
                code: 408
            });
        }else{
            let path = await Image.selectPath(id_image);
            fs.unlinkSync(path);
            let update = await Image.change(id_image, file.path);
            return res.json({
                code: 200
            })
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

// function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

module.exports = router;