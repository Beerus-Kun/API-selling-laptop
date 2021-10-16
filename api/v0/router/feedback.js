const express = require('express');
const router = express.Router();
const Feedback = require('../module/feedback');
const Auth = require('../../../auth');

/**
 * Lấy 1 feedback
 * @permission      admin
 * @params        id_feedback
 * @returns     202, 412
 */
router.get('/information/:id_feedback', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let id_feedback = req.params.id_feedback;

        let exist = await Feedback.has(id_feedback);
        if(!exist){
            return res.json({
                code: 412
            })
        }

        let read = await Feedback.updateRead(id_feedback);
        let data = await Feedback.selectID(id_feedback);
            
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
 * Lấy tất cả feedback
 * @permission  admin
 * @query        is_unread, page, num_rows
 * @returns     202
 */
router.get('/all', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let is_unread = req.query.is_read;
        let page = req.query.page;
        let num_rows = req.query.num_rows;
        let data = [];

        if(!is_unread){
            is_unread = 0;
        }

        if(!page){
            page = 1;
        }

        if(!num_rows){
            num_rows = 10;
        }

        if(is_unread == 0){
            data = await Feedback.selectAll(page, num_rows);
        }else{
            data = await Feedback.selectUnread(page, num_rows);
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
 * Lấy số lượng feedback
 * @permission  admin
 * @query       is_unread
 * @returns     208
 */
router.get('/all/amount', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let is_unread = req.query.is_unread;
        let amount;
        if(!is_unread){
            is_unread = 0;
        }

        if(is_unread == 0){
            amount = await Feedback.selectAmountAll();
        }else{
            amount = await Feedback.selectAmountUnread();
        }

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
 * Xóa feedback 
 * @permission  admin
 * @params       id_feedback 
 * @returns     200, 412
 */
router.delete('/:id_feedback', Auth.authenAdmin, async(req, res, next)=>{
    try{
        let id_feedback = req.params.id_feedback;
        let exist = await Feedback.has(id_feedback);
        if(!exist){
            return res.json({
                code: 412
            })
        }else{
            let deleted = await Feedback.delete(id_feedback);
            return res.json({
                code: 200
            })
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
})

/**
 * Thêm feedback 
 * @body       subject, content
 * @returns     200, 400
 */
router.post('/', Auth.authenUser, async(req, res, next)=>{
    try{
        let id_account = Auth.tokenData(req).id_account;
        let subject = req.body.subject;
        let content = req.body.content;
        if(subject && content){
            let add = await Feedback.add(id_account, subject, content);
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