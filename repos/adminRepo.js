var db = require('../fn/db.js');

exports.loadBook = () => {
	var sql = 'select * from bs_sach';
	return db.load(sql);
}

exports.loadAuthor = () => {
	var sql = 'select * from bs_tac_gia';
	return db.load(sql);
}