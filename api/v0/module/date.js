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

db.selectCurrentDay = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT EXTRACT(DAY FROM current_timestamp) AS day',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].day)
        })
    })
}

db.selectCurrentMonth = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT EXTRACT(MONTH FROM current_timestamp) AS month',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].month)
        })
    })
}

db.selectCurrentYear = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT EXTRACT(YEAR FROM current_timestamp) AS year',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].year)
        })
    })
}

module.exports = db;