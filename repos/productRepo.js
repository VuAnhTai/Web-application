var db = require('../fn/db')
var config = require('../config/config');

exports.loadAllByCat= (catId, offset) => {
    var sql = `SELECT * FROM bs_sach, bs_loai_sach WHERE (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = 0 and bs_loai_sach.id = ${catId}) or (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = ${catId}) limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
	var sql = `select count(*) as total from bs_sach, bs_loai_sach where bs_sach.id_loai_sach = bs_loai_sach.id or bs_loai_sach.id_loai_cha = ${catId}`;
    return db.load(sql);
}

exports.loadAllBySup= (supId, offset) => {
    var sql = `SELECT * FROM bs_sach, bs_nha_xuat_ban WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id AND bs_nha_xuat_ban.id = ${catId} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countBySup = supId => {
	var sql = `SELECT * FROM bs_sach, bs_nha_xuat_ban WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id AND bs_nha_xuat_ban.id = ${catId}`;
    return db.load(sql);
}