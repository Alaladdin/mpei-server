module.exports = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;
