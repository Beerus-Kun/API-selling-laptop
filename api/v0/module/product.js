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

db.add = (id_brand, id_image, name, information, released_year, warranty, price, note)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`INSERT INTO product (id_brand, id_image, name, information, released_year, warranty, price, current_price, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8)
        RETURNING id_product`,
        [id_brand, id_image, name, information, released_year, warranty, price, note],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].id_product)
        })
    })
}

db.has = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM product WHERE id_product = $1',
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rowCount>0)
        })
    })
}

db.update = (id_product, id_brand, id_image, name, information, released_year, warranty, price, note)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`UPDATE product 
                    SET id_brand = $1, id_image = $2, name = $3, note = $8,
                    information = $4, released_year = $5, warranty = $6, price = $7
                    WHERE id_product = $9`,
        [id_brand, id_image, name, information, released_year, warranty, price, note, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updatePrice = (id_product,new_price)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE product SET current_price = $1 WHERE id_product = $2',
        [new_price, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.updateStatus = (id_product, new_status)=>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE product SET status = $1 WHERE id_product = $2',
        [new_status, id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectID = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.information, 
                    p.released_year, p.warranty, p.status,
                    p.price, p.current_price, p.note
                    FROM product p, brand b
                    WHERE p.id_brand = b.id_brand AND p.id_product = $1`,
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectCurrentPrice = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT current_price FROM product WHERE id_product = $1',
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].current_price)
        })
    })
}

db.selectStatus = (id_product)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT status FROM product WHERE id_product = $1',
        [id_product],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].status)
        })
    })
}

db.selectAll = (page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price
                    FROM product p, brand b
                    WHERE p.id_brand = b.id_brand
                    ORDER BY p.status DESC, p.released_year
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
        pool.query('SELECT COUNT(id_product) AS amount FROM product',
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectPriceASC = (lowest_price, highest_price, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price
                    FROM product p, brand b
                    WHERE status > 0 AND current_price > $1 
                    AND current_price <$2 AND b.id_brand = p.id_brand
                    ORDER BY current_price, status DESC
                    LIMIT $4 OFFSET $3`,
        [lowest_price, highest_price, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectPriceDESC = (lowest_price, highest_price, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price
                    FROM product p, brand b
                    WHERE status > 0 AND current_price > $1 
                    AND current_price <$2 AND p.id_brand = b.id_brand
                    ORDER BY current_price DESC, status DESC
                    LIMIT $4 OFFSET $3`,
        [lowest_price, highest_price, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectPrice = (lowest_price, highest_price, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price
                    FROM product p, brand b
                    WHERE status > 0 AND current_price > $1 
                    AND current_price <$2 AND p.id_brand = b.id_brand
                    ORDER BY status DESC
                    LIMIT $4 OFFSET $3`,
        [lowest_price, highest_price, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountPrice = (lowest_price, highest_price)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_product) as amount FROM product 
                    WHERE status > 0 AND current_price > $1 AND current_price <$2`,
        [lowest_price, highest_price],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectBrand = (id_brand, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price 
                    FROM product p, brand b
                    WHERE p.status > 0 AND p.id_brand = $1
                    AND p.id_brand = b.id_brand
                    ORDER BY p.status DESC, p.price
                    LIMIT $3 OFFSET $2`,
        [id_brand, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectBrandASC = (id_brand, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price 
                    FROM product p, brand b
                    WHERE p.status > 0 AND p.id_brand = $1
                    AND p.id_brand = b.id_brand
                    ORDER BY p.price, p.status DESC
                    LIMIT $3 OFFSET $2`,
        [id_brand, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectBrandDESC = (id_brand, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price
                    FROM product p, brand b
                    WHERE p.status > 0 AND p.id_brand = $1
                    AND p.id_brand = b.id_brand
                    ORDER BY p.price DESC, p.status DESC
                    LIMIT $3 OFFSET $2`,
        [id_brand, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountBrand = (id_brand)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_product) AS amount
                    FROM product WHERE id_brand = $1`,
        [id_brand],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

db.selectSearch = (search, page, num_rows)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT p.id_product, b.name as brand, 
                    p.id_image, p.name, p.status,
                    p.price, p.current_price 
                    FROM product p, brand b 
                    WHERE POSITION(LOWER($1) IN LOWER(p.name))>0 AND b.id_brand = p.id_brand
                    ORDER BY status DESC
                    LIMIT $3 OFFSET $2`,
        [search, (page-1)*num_rows, num_rows],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows)
        })
    })
}

db.selectAmountSearch = (search)=>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT COUNT(id_product) AS amount
                    FROM product
                    WHERE POSITION(LOWER($1) IN LOWER(name))>0`,
        [search],
        (err, result)=>{
            if(err) return reject(err);
            return resolve(result.rows[0].amount)
        })
    })
}

module.exports = db;