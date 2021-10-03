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

db.add = (email, password, name, phone, address, sex, position)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO account(email, password, name, phone, address, sex, position) VALUES (LOWER($1), $2, $3, $4, $5, $6, $7) RETURNING id_account',
        [email, password, name, phone, address, sex, position],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_account)
        })
    })
}

db.hasId = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM account WHERE id_account = LOWER($1)',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.hasEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM account WHERE email=$1',
        [email],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.hasAdmin = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM account WHERE position = 2',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.selectID = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT id_account, email, position, name, phone, address, sex, status FROM account WHERE id_account = $1',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

db.selectEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT id_account, email, name, phone, position, password, address, sex, status FROM account WHERE email = $1',
        [email],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

db.selectPosition = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT position FROM account WHERE id_account = $1',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].position)
        })
    })
}

db.selectPositionEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT position FROM account WHERE email = $1',
        [email],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].position)
        })
    })
}

db.selectPassword = (email)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT password FROM account WHERE email = $1',
        [email],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].password)
        })
    })
}

db.selectAll = (page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT id_account, email, name, phone, address, sex, status
                    FROM account 
                    ORDER BY status, email
                    LIMIT $1 OFFSET $2 `,
        [num_rows, (page-1)*num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountAll = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT COUNT(id_account) AS amount FROM account',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectAllLock = (page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT id_account, email, name, phone, address, sex, status
                    FROM account 
                    WHERE status = 0
                    ORDER BY status, email
                    LIMIT $1 OFFSET $2 `,
        [num_rows, (page-1)*num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountLock = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT COUNT(id_account) AS amount FROM account WHERE status = 0',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectSearch = (search, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`WITH search AS (
                        SELECT id_account, email, name, phone, address, sex, status, POSITION(LOWER($1) IN email) AS index
                        FROM account 
                        ORDER BY ind
                    )

                    SELECT * FROM search WHERE index>0 
                    LIMIT $2 OFFSET $3`,
        
                    // SELECT id_account, email, name, phone, address, sex, status
                    // FROM account 
                    // WHERE POSITION($1 IN email)>0
                    // LIMIT 10 OFFSET $2`,
        [search, num_rows, (page-1)*num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountSearch = (search)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT COUNT(id_account) AS amount FROM account WHERE POSITION(LOWER($1) IN email)>0',
        [search],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.update = (id_account, name, phone, address, sex)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`UPDATE account 
                    SET phone = $1, address = $2, sex = $3, name = $4
                    WHERE id_account = $5`,
        [phone, address, sex, name, id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

db.addVerification = (email, verification)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE account SET verification = $1 WHERE email = $2 ',
        [verification, email],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updatePosition = (id_account, position)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE account SET position = $1 WHERE id_account = $2',
        [position, id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updateStatus = (id_account, status)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE account SET status = $1 WHERE id_account = $2',
        [status, id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updatePassword = (id_account, new_password)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE account SET password = $1 WHERE id_account = $2',
        [new_password, id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

module.exports = db;