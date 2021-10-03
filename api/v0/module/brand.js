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

db.add = (name)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO brand(name) VALUES ($1) RETURNING id_brand',
        [name],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_brand)
        })
    })
}

db.hasName = (name)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM brand WHERE LOWER(name) = LOWER($1)',
        [name],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.has = (id_brand)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM brand WHERE id_brand = $1',
        [id_brand],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.update = (id_brand, name)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE brand SET name = $1 WHERE id_brand =$2',
        [name, id_brand],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAll = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * FROM brand 
                    ORDER BY name`,
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectSearch = (search)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`WITH search AS(
                        SELECT *, POSITION(LOWER($1) IN LOWER(name)) AS index
                        FROM brand
                        ORDER BY index
                    )
                    SELECT * FROM search
                    WHERE index>0`,
        [search],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

module.exports = db;