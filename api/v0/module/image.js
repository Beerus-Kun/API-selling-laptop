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

db.add = (path)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO image (path) VALUES ($1) RETURNING id_image',
        [path],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_image)
        })
    })
}

db.selectPath = (id_image)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT path FROM image WHERE id_image=$1',
        [id_image],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].path)
        })
    })
}

db.selectAll = (num_rows, page)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT id_image
                    FROM image 
                    ORDER BY id_image
                    LIMIT $1 OFFSET $2`,
        [num_rows, (page-1)*num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountAll = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT COUNT(id_image) as amount FROM image',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.change = (id_image, path)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE image SET path = $1 WHERE id_image =$2',
        [path, id_image],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.has = (id_image)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM image WHERE id_image = $1',
        [id_image],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.hasInProduct = (id_image)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM product WHERE id_image = $1',
        [id_image],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.delete = (id_image)=>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM image WHERE id_image = $1',
        [id_image],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

module.exports = db;