const express = require('express');
const router = express.Router();
const Product = require('../module/product');
const Image = require('../module/image');
const Brand = require('../module/brand');
const Auth = require('../../../auth');
const Inventory = require('../module/inventory');

/**
 * Lấy 1 sản phẩm
 * @params        id_product
 * @returns     202, 411
 */
router.get('/information/:id_product', async(req, res, next)=>{
    try{
        let id_product = req.params.id_product;

        let exist = await Product.has(id_product);
        if(exist){
            let data = await Product.selectID(id_product);
            return res.json({
                code: 202,
                data: data
            })
        }else{
            return res.json({
                code: 411
            })
        }

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Lấy tất cả sản phẩm theo page
 * @query       page, num_rows,
 *              is_sorted_price, sorted_price (0-giam, 1-tang),
 *              lowest_price, highest_price
 *              is_brand, id_brand,
 *              is_search_name, search,
 * @returns     202, 423
 */
router.get('/all', async(req, res, next)=>{
    try{
        let page = Number(req.query.page);
        let num_rows = Number(req.query.num_rows);
        let is_sorted_price = req.query.is_sorted_price;
        let sorted_price = req.query.sorted_price;
        let lowest_price = req.query.lowest_price;
        let highest_price = req.query.highest_price;
        let is_brand = req.query.is_brand;
        let id_brand = req.query.id_brand;
        let is_search_name = req.query.is_search_name;
        let search = req.query.search;

        let data;

        if(!num_rows){
            num_rows = 10;
        }
        
        if(!(page)){
            page = 1;
        }
        
        if(is_brand == 1){
            if(!id_brand) {
                return res.json({
                    code: 423
                })
            }

            if(is_sorted_price == 1){
                data = await Product.selectBrandASC(id_brand, page, num_rows);
            }else if(is_sorted_price == 0){
                data = await Product.selectBrandDESC(id_brand, page, num_rows);
            }else{
                data = await Product.selectBrand(id_brand, page, num_rows);
            }
        }else if(is_search_name == 1){
            if(!search){
                return res.json({
                    code: 423
                })
            }else{
                search = decodeURIComponent(search);
                data = await Product.selectSearch(search, page, num_rows);
            }
        }else{
            if(is_sorted_price == 1){
                if(!lowest_price){
                    lowest_price = 0;
                }
                if(!highest_price){
                    highest_price = 999999999;
                }
                if(sorted_price == 1){
                    data = await Product.selectPriceASC(lowest_price, highest_price, page, num_rows);
                }else if(sorted_price == 0){
                    data = await Product.selectPriceDESC(lowest_price, highest_price, page, num_rows);
                }else{
                    data = await Product.selectPrice(lowest_price, highest_price, page, num_rows);
                }
            }else{
                data = await Product.selectAll(page, num_rows);
            }
        }

        return res.json({
            code: 202,
            data: data
        })
        
    }catch(err){
        console.log(500);
        return res.sendStatus(500);
    }
})

/**
 * Lấy số lượng sản phẩm hiện có
 * @query       is_sorted_price,
 *              lowest_price, highest_price
 *              is_brand, id_brand,
 *              is_search_name, search,
 * @returns     208, 423
 */
router.get('/all/amount', async(req, res, next)=>{
    try{
        let amount;
        let is_sorted_price = req.query.is_sorted_price;
        let lowest_price = req.query.lowest_price;
        let highest_price = req.query.highest_price;
        let is_brand = req.query.is_brand;
        let id_brand = req.query.id_brand;
        let is_search_name = req.query.is_search_name;
        let search = req.query.search;

        if(is_brand == 1){
            if(!id_brand){
                return res.json({
                    code: 423
                })
            }else{
                amount = await Product.selectAmountBrand(id_brand);
            }
        }else if(is_search_name == 1){
            if(!search){
                return res.json({
                    code: 423
                })
            }
            search = decodeURIComponent(search);
            amount = await Product.selectAmountSearch(search);
        }else{
            if(is_sorted_price == 1){
                if(!lowest_price){
                    lowest_price = 0;
                }
                if(!highest_price){
                    highest_price = 999999999;
                }
                amount = await Product.selectAmountPrice(lowest_price, highest_price);
            }else{
                amount = await Product.selectAmountAll();
            }
        }

        return res.json({
            code: 208,
            amount: amount
        })
    }catch(err){
        console.log(500);
        return res.sendStatus(500);
    }
})

/**
 * Thêm sản phẩm
 * @body        id_brand, id_image, name, 
 * information, released_year, warranty, price, note
 * @returns     201, 400, 406, 410
 */
router.post('/', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let id_brand = req.body.id_brand;
        let id_image = req.body.id_image;
        let name = req.body.name;
        let information = req.body.information;
        let released_year = req.body.released_year;
        let warranty = req.body.warranty;
        let price = req.body.price;
        let note = req.body.note;

        if(!note){
            note = ""
        }

        if(id_brand && id_image && name && information && released_year && warranty && price){
            let existBrand = await Brand.has(id_brand);
            if(!existBrand){
                return res.json({
                    code: 410
                })
            }

            let existImage = await Image.has(id_image);
            if(!existImage){
                return res.json({
                    code: 406
                })
            }

            let id_product = await Product.add(id_brand, id_image, name, information, released_year, warranty, price, note);
            let id_inventory = await Inventory.add(id_product);
            
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

/**
 * chỉnh sửa giá mới cho sản phẩm
 * @permission  admin
 * @body        new_price
 * @params      id_product
 * @returns     200, 400, 411
 */
router.put('/update/price/:id_product', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let new_price = req.body.new_price;
        let id_product = req.params.id_product;
        if(new_price && id_product){
            let exist = await Product.selectID(id_product);
            if(!exist){
                return res.json({
                    code: 411
                })
            }

            let update = await Product.updatePrice(id_product, new_price);
            return res.json({
                code: 200
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
 * chỉnh sửa thông tin sản phẩm
 * @permission  người làm việc
 * @params      id_product
 * @body        id_brand, id_image, name,
 *              information, released_year, 
 *              warranty, price, note
 * @returns     200, 400, 406, 410, 411
 */
 router.put('/update/:id_product', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let id_product = req.params.id_product;
        let id_brand = req.body.id_brand;
        let id_image = req.body.id_image;
        let name = req.body.name;
        let information = req.body.information;
        let released_year = req.body.released_year;
        let warranty = req.body.warranty;
        let price = req.body.price;
        let note = req.body.note;

        if(!note){
            note = ""
        }

        if(id_brand && id_image && name && information && released_year && warranty && price && id_product){
            let existBrand = await Brand.has(id_brand);
            if(!existBrand){
                return res.json({
                    code: 410
                })
            }

            let existImage = await Image.has(id_image);
            if(!existImage){
                return res.json({
                    code: 406
                })
            }

            let existProduct = await Product.has(id_product);
            if(!existProduct){
                return res.json({
                    code: 411
                })
            }

            let update = await Product.update(id_product, id_brand, id_image, name, information, released_year, warranty, price, note);
            
            return res.json({
                code: 200
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
 * chỉnh sửa tình trạng cho sản phẩm
 * @permisstion người làm việc
 * @params      id_product
 * @body        new_status(0-het hang, 1-co san, 2-hang uu tien, 3-khuyen mai)
 */
router.put('/update/status/:id_product', Auth.authenPersonel, async(req, res, next)=>{
    try{
        let id_product = req.params.id_product;
        let new_status = req.body.new_status;

        if(new_status){
            let exist = await Product.has(id_product);
            if(!exist){
                return res.json({
                    code: 411
                })
            }
            let update = await Product.updateStatus(id_product, new_status);

            return res.json({
                code: 200
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

module.exports = router;