var db = require('../fn/db')
var config = require('../config/config');

exports.loadAllByCat= (catId, offset) => {
    var sql = `SELECT bs_sach.*, bs_loai_sach.ten_loai_sach, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_loai_sach, bs_tac_gia 
        WHERE 
        (
            bs_sach.id_loai_sach = bs_loai_sach.id 
            and bs_loai_sach.id_loai_cha = 0 
            and bs_loai_sach.id = ${catId} 
            and bs_sach.id_tac_gia = bs_tac_gia.id
        ) 
        or (
            bs_sach.id_loai_sach = bs_loai_sach.id 
            and bs_loai_sach.id_loai_cha = ${catId} 
            and bs_sach.id_tac_gia = bs_tac_gia.id
        ) 
        limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
	var sql = `select count(*) as total from bs_sach, bs_loai_sach where (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = 0 and bs_loai_sach.id = ${catId}) or (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = ${catId})`;
    return db.load(sql);
}

exports.loadAllBySup= (supId, offset) => {
    var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
    	WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id  
    	and bs_nha_xuat_ban.id = ${supId} 
    	and bs_sach.id_tac_gia = bs_tac_gia.id 
    	limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countBySup = supId => {
	var sql = `SELECT * FROM bs_sach, bs_nha_xuat_ban WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id AND bs_nha_xuat_ban.id = ${supId} and bs_nha_xuat_ban.id = ${supId}`;
    return db.load(sql);
}

exports.single = proId => {
	var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
    FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
	WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id 
		and bs_sach.id = ${proId} 
		and bs_sach.id_tac_gia = bs_tac_gia.id`;
    return db.load(sql);
}

exports.loadBySup= (supId) => {
    var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
        WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id  
        and bs_nha_xuat_ban.id = ${supId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id
        limit 5`;
    return db.load(sql);
}

exports.loadByCat= (catId) => {
    var sql = `SELECT bs_sach.*, bs_loai_sach.ten_loai_sach, bs_tac_gia.ten_tac_gia 
    FROM bs_sach, bs_loai_sach, bs_tac_gia 
    WHERE 
    ( 
        bs_sach.id_loai_sach = bs_loai_sach.id 
        and bs_loai_sach.id_loai_cha = 0 
        and bs_loai_sach.id = ${catId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id 
    ) 
    or ( 
        bs_sach.id_loai_sach = bs_loai_sach.id 
        and bs_loai_sach.id_loai_cha = ${catId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id 
    ) 
    limit 5`;
    return db.load(sql);
}