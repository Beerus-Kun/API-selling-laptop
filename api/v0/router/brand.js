const express = require('express');
const Brand = require('../module/brand');
const Auth = require('../../../auth');
const router = express.Router();

/**
 * Lấy tất cả hãng theo page
 * @query       search
 * @returns     202
 */
router.get('/all', async(req, res, next)=>{
    try{
        let search = req.query.search;
        let data = [];
        if(search){
            search = decodeURIComponent(search);
            data = await Brand.selectSearch(search);
        }else{
            data = await Brand.selectAll();
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
 * Thêm hãng mới
 * @permisstion người trong kho
 * @body        name
 * @returns     201, 400, 409
 */
router.post('/', Auth.authenStocker, async(req, res, next)=>{
    try{
        let name = req.body.name;
        if(!name){
            return res.json({
                code: 400
            })
        }

        name = name.trim();
        let exist = await Brand.hasName(name);
        if(exist){
            return res.json({
                code: 409
            })
        }else{
            let add = await Brand.add(name);
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
 * Thay đổi tên
 * @permisstion người làm việc
 * @params      id_brand
 * @body        new_name
 * @returns     200, 400, 409
 */
router.put('/:id_brand', Auth.authenStocker, async(req, res, next)=>{
    try{
        let id_brand = req.params.id_brand;
        let new_name = req.body.new_name;

        if(!new_name){
            return res.json({
                code: 400
            })
        }
        new_name = new_name.trim();
        let exist = await Brand.hasName(new_name);
        if(exist){
            return res.json({
                code: 409
            })
        }else{
            let update = await Brand.update(id_brand, new_name);
            return res.json({
                code: 200
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

module.exports = router;