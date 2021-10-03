const validation = {};

validation.isNumber=(n)=>{
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

module.exports = validation;