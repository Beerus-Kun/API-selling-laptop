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
        pool.query('INSERT INTO cart (id_account, id_product, quantity) VALUES ($1, $2, $3) RETURNING id_cart',
        [id_account, id_product, quantity],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_cart)
        })
    })
}

db.has = (id_cart)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cart WHERE id_cart = $1',
        [id_cart],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.hasProductAccount = (id_account, id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT id_cart FROM cart WHERE id_account = $1 AND id_product = $2',
        [id_account, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve({
                exist: result.rowCount>0,
                result: result.rows[0]
            })
        })
    })
}

db.hasAccount = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cart WHERE id_account = $1',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.updateQuantity = (id_cart, quantity)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE cart SET quantity = $1 WHERE id_cart = $2',
        [quantity, id_cart],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.addQuantity = (id_cart, quantity)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE cart SET quantity = quantity + $2 WHERE id_cart = $1',
        [id_cart, quantity],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.delete = (id_cart)=>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM cart WHERE id_cart = $1',
        [id_cart],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.deleteAccount = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM cart WHERE id_account = $1',
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAccount = (id_account)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT c.id_cart, p.name, c.quantity, c.id_product, p.current_price, p.warranty
                FROM cart c, product p 
                WHERE c.id_product = p.id_product AND
                c.id_account = $1`,
        [id_account],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectID = (id_cart)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM cart WHERE id_cart = $1',
        [id_cart],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0])
        })
    })
}

module.exports = db;