const pool = require('../../../database');

const db = {};
// db. = ()=>{
//     return new Promise((resolve, reject)=>{
//         pool.query('',
//         [],
//         (err, result)=>{
//             if(err) return reject(err);
//             return resolve(result.rows)
//         })
//     })
// }

db.add = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO inventory (id_product) VALUES ($1)',
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmount = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT (amount - sold) as left FROM inventory WHERE id_product = $1',
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].left)
        })
    })
}

db.updateSold = (id_product, new_sold)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE inventory SET sold = sold + $1 WHERE id_product = $2',
        [new_sold, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updateAmount = (id_product, add_number)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE inventory SET amount = amount + $1 WHERE id_product = $2',
        [add_number, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}
module.exports = db;