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

db.add = (id_account, id_product, quantity)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO import (id_account, id_product, quantity) VALUES ($1, $2, $3) RETURNING id_import',
        [id_account, id_product, quantity],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_import)
        })
    })
}

db.has = (id_import)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM import WHERE id_import = $1',
        [id_import],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.updateQuantity = (id_import, new_quantity)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE import SET quantity = $1 WHERE id_import = $2',
        [new_quantity, id_import],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectID = (id_import)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT i.id_import, a.name AS account_name, a.email,
                    p.name AS product_name, i.quantity, i.id_product, i.id_account,
                    TO_CHAR(i.date_time :: time, 'hh24:mi:ss') as time,
                    TO_CHAR(i.date_time :: date, 'dd/mm/yyyy') as date
                    FROM import i, account a, product p
                    WHERE i.id_account = a.id_account
                    AND i.id_product = p.id_product
                    AND i.id_import = $1`,
        [id_import],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

db.selectAll = (page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT i.id_import, a.name AS account_name, 
                    p.name AS product_name, i.quantity, 
                    TO_CHAR(i.date_time :: time, 'hh24:mi') as time,
                    TO_CHAR(i.date_time :: date, 'dd/mm/yyyy') as date
                    FROM import i, account a, product p
                    WHERE i.id_account = a.id_account
                    AND i.id_product = p.id_product
                    ORDER BY i.date_time, i.id_import
                    LIMIT $2 OFFSET $1`,
        [(page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountAll = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_import) AS amount FROM import`,
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectDay = (date, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT i.id_import, a.name AS account_name, 
                    p.name AS product_name, i.quantity, 
                    TO_CHAR(i.date_time :: time, 'hh24:mi') as time,
                    TO_CHAR(i.date_time :: date, 'dd/mm/yyyy') as date
                    FROM import i, account a, product p
                    WHERE i.id_account = a.id_account
                    AND i.id_product = p.id_product
                    AND TO_CHAR(i.date_time :: date, 'yyyy-mm-dd') = $1
                    ORDER BY i.date_time, i.id_import
                    LIMIT $3 OFFSET $2`,
        [date, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountDay = (date)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_import) AS amount
                    FROM import
                    WHERE TO_CHAR(date_time :: date, 'yyyy-mm-dd') = $1`,
        [date],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectProduct = (id_product, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT i.id_import, a.name AS account_name, 
                    p.name AS product_name, i.quantity, 
                    TO_CHAR(i.date_time :: time, 'hh24:mi') as time,
                    TO_CHAR(i.date_time :: date, 'dd/mm/yyyy') as date
                    FROM import i, account a, product p
                    WHERE i.id_account = a.id_account
                    AND i.id_product = p.id_product
                    AND i.id_product = $1
                    ORDER BY i.date_time, i.id_import
                    LIMIT $3 OFFSET $2`,
        [id_product, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountProduct = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_import) AS amount
                    FROM import WHERE id_product = $1`,
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}
module.exports = db;