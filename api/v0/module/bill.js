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

db.addBill = (id_account, address)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO bill (id_account, address) VALUES ($1, $2) RETURNING id_bill',
        [id_account, address],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_bill)
        })
    })
}

db.addItem = (id_bill, id_product, quantity, price, warranty)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`INSERT INTO bill_item (id_bill, id_product, quantity, price, warranty)
        VALUES ($1, $2, $3, $4, $5)`,
        [id_bill, id_product, quantity, price, warranty],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.has = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM bill WHERE id_bill=$1',
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.updateStatus = (id_bill, new_status)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE bill SET status = $1 WHERE id_bill = $2',
        [new_status, id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updateTotal = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`UPDATE bill SET total_money = 
            (SELECT SUM(price) FROM bill_item WHERE id_bill = $1)
            WHERE id_bill = $1`,
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAccount = (id_account, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT *,
                    TO_CHAR(date_time :: time, 'hh24:mi:ss') as time,
                    TO_CHAR(date_time :: date, 'dd/mm/yyyy') as date
                    FROM bill 
                    WHERE id_account = $1
                    ORDER BY date_time, id_bill
                    LIMIT $3 OFFSET $2`,
        [id_account, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountAccount = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT COUNT(id_bill) AS amount FROM bill WHERE id_account = $1',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectIdAccount = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT id_account FROM bill WHERE id_bill = $1',
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_account)
        })
    })
}

db.selectStatusID = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT status FROM bill WHERE id_bill = $1',
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].status)
        })
    })
}

db.selectItems = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.name, b.quantity, b.price, b.id_product, b.warranty, p.id_image, br.name AS brand_name
                    FROM bill_item b, product p, brand br
                    WHERE b.id_product = p.id_product AND p.id_brand = br.id_brand AND
                    b.id_bill = $1`,
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectBill = (id_bill)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT b.id_bill, a.name, b.address, b.total_money, b.status,
                    TO_CHAR(b.date_time :: time, 'hh24:mi:ss') as time,
                    TO_CHAR(b.date_time :: date, 'dd/mm/yyyy') as date
                    FROM bill b, account a
                    WHERE b.id_account = a.id_account AND 
                    b.id_bill = $1`,
        [id_bill],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

db.selectAllDay = (date, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT b.id_bill, a.email, a.name, b.total_money, b.status,
                    TO_CHAR(b.date_time :: time, 'hh24:mi:ss') as time
                    FROM bill b, account a
                    WHERE b.id_account = a.id_account
                    AND TO_CHAR(b.date_time :: date, 'yyyy-mm-dd') = $1
                    ORDER BY b.date_time, b.id_bill
                    LIMIT $3 OFFSET $2`,
        [date, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountAllDay = (date)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_bill) AS amount 
                    FROM bill
                    WHERE TO_CHAR(date_time :: date, 'yyyy-mm-dd') = $1`,
        [date],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectTotalAllDay = (date)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT SUM(total_money) AS total
                    FROM bill
                    WHERE TO_CHAR(date_time :: date, 'yyyy-mm-dd') = $1 
                    AND status = 3`,
        [date],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].total)
        })
    })
}

module.exports = db;