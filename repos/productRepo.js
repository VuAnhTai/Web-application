var db = require('../fn/db')
var config = require('../config/config');

exports.loadAllProduct= (offset) => {
    var sql = `SELECT bs_sach.*, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_tac_gia 
        WHERE bs_sach.id_tac_gia = bs_tac_gia.id and bs_sach.trang_thai = 1
        limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.loadAllByCat= (catId, offset) => {
    var sql = `SELECT bs_sach.*, bs_loai_sach.ten_loai_sach, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_loai_sach, bs_tac_gia 
        WHERE 
        (
            bs_sach.id_loai_sach = bs_loai_sach.id 
            and bs_loai_sach.id_loai_cha = 0 
            and bs_loai_sach.id = ${catId} 
            and bs_sach.id_tac_gia = bs_tac_gia.id
            and bs_sach.trang_thai = 1
        ) 
        or (
            bs_sach.id_loai_sach = bs_loai_sach.id 
            and bs_loai_sach.id_loai_cha = ${catId} 
            and bs_sach.id_tac_gia = bs_tac_gia.id
            and bs_sach.trang_thai = 1
        ) 
        limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = catId => {
	var sql = `select count(*) as total from bs_sach, bs_loai_sach where (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = 0 and bs_loai_sach.id = ${catId} and bs_sach.trang_thai = 1) or (bs_sach.id_loai_sach = bs_loai_sach.id and bs_loai_sach.id_loai_cha = ${catId} and bs_sach.trang_thai = 1)`;
    return db.load(sql);
}

exports.loadAllBySup= (supId, offset) => {
    var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
    	WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id  
    	and bs_nha_xuat_ban.id = ${supId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id
        and bs_sach.trang_thai = 1 
    	limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countBySup = supId => {
	var sql = `SELECT count(*) as total FROM bs_sach, bs_nha_xuat_ban WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id AND bs_nha_xuat_ban.id = ${supId} and bs_nha_xuat_ban.id = ${supId} and bs_sach.trang_thai = 1`;
    return db.load(sql);
}

exports.single = proId => {
	var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
    FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
	WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id 
		and bs_sach.id = ${proId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id
        and bs_sach.trang_thai = 1`;
    return db.load(sql);
}

exports.loadBySup= (supId) => {
    var sql = `SELECT bs_sach.*, bs_nha_xuat_ban.ten_nha_xuat_ban, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_nha_xuat_ban, bs_tac_gia 
        WHERE bs_sach.id_nha_xuat_ban = bs_nha_xuat_ban.id  
        and bs_nha_xuat_ban.id = ${supId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id
        and bs_sach.trang_thai = 1
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
        and bs_sach.trang_thai = 1
    ) 
    or ( 
        bs_sach.id_loai_sach = bs_loai_sach.id 
        and bs_loai_sach.id = ${catId} 
        and bs_sach.id_tac_gia = bs_tac_gia.id
        and bs_sach.trang_thai = 1 
    ) `;
    return db.load(sql);
}

exports.updateSL = (id, SLT, SLB) => {
    var sql = `update bs_sach set sl_ban=${SLB},so_luong_ton=${SLT} where id=${id}`
    return db.save(sql);
}

exports.search = (stringSearch, offset) => {
    var sql = `SELECT SACH.*, NXB.ten_nha_xuat_ban, TG.ten_tac_gia, LS.ten_loai_sach
                FROM bs_sach as SACH
                LEFT JOIN bs_tac_gia as TG on SACH.id_tac_gia = TG.id 
                LEFT JOIN bs_nha_xuat_ban as NXB on SACH.id_nha_xuat_ban = NXB.id 
                LEFT JOIN bs_loai_sach as LS on SACH.id_loai_sach = LS.id 
                LEFT JOIN (SELECT id, ten_loai_sach FROM bs_loai_sach WHERE id_loai_cha = 0) 
                    as LSPARENT on LS.id_loai_cha = LSPARENT.id 
                WHERE (SACH.ten_sach LIKE '%${stringSearch}%' ||
                NXB.ten_nha_xuat_ban LIKE '%${stringSearch}%' ||
                TG.ten_tac_gia LIKE '%${stringSearch}%' ||
                LS.ten_loai_sach LIKE '%${stringSearch}%') and SACH.trang_thai = 1
                limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    // var sql = `SELECT * FROM users WHERE SACH.ten_sach LIKE '%${stringSearch}%'`
    console.log(sql);
    return db.load(sql);
}
exports.countSearch = (stringSearch) => {
    var sql = `SELECT count(*) as total
                FROM bs_sach as SACH
                LEFT JOIN bs_tac_gia as TG on SACH.id_tac_gia = TG.id 
                LEFT JOIN bs_nha_xuat_ban as NXB on SACH.id_nha_xuat_ban = NXB.id 
                LEFT JOIN bs_loai_sach as LS on SACH.id_loai_sach = LS.id 
                LEFT JOIN (SELECT id, ten_loai_sach FROM bs_loai_sach WHERE id_loai_cha = 0) 
                    as LSPARENT on LS.id_loai_cha = LSPARENT.id 
                WHERE (SACH.ten_sach LIKE '%${stringSearch}%' ||
                NXB.ten_nha_xuat_ban LIKE '%${stringSearch}%' ||
                TG.ten_tac_gia LIKE '%${stringSearch}%' ||
                LS.ten_loai_sach LIKE '%${stringSearch}%') and SACH.trang_thai = 1`;
    // var sql = `SELECT * FROM users WHERE SACH.ten_sach LIKE '%${stringSearch}%'`
    return db.load(sql);
}

exports.searchByPrice = (value1, value2, offset) => {
    var sql = `SELECT SACH.*, NXB.ten_nha_xuat_ban, TG.ten_tac_gia, LS.ten_loai_sach
                FROM bs_sach as SACH
                LEFT JOIN bs_tac_gia as TG on SACH.id_tac_gia = TG.id 
                LEFT JOIN bs_nha_xuat_ban as NXB on SACH.id_nha_xuat_ban = NXB.id 
                LEFT JOIN bs_loai_sach as LS on SACH.id_loai_sach = LS.id 
                LEFT JOIN (SELECT id, ten_loai_sach FROM bs_loai_sach WHERE id_loai_cha = 0) 
                    as LSPARENT on LS.id_loai_cha = LSPARENT.id 
                WHERE (SACH.don_gia BETWEEN ${value1} AND ${value2}) and SACH.trang_thai = 1
                limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    // var sql = `SELECT * FROM users WHERE SACH.ten_sach LIKE '%${stringSearch}%'`
    return db.load(sql);
}
exports.countSearchByPrice = (value1, value2) => {
    var sql = `SELECT count(*) as total
                FROM bs_sach as SACH
                LEFT JOIN bs_tac_gia as TG on SACH.id_tac_gia = TG.id 
                LEFT JOIN bs_nha_xuat_ban as NXB on SACH.id_nha_xuat_ban = NXB.id 
                LEFT JOIN bs_loai_sach as LS on SACH.id_loai_sach = LS.id 
                LEFT JOIN (SELECT id, ten_loai_sach FROM bs_loai_sach WHERE id_loai_cha = 0) 
                    as LSPARENT on LS.id_loai_cha = LSPARENT.id 
                WHERE (SACH.don_gia BETWEEN ${value1} AND ${value2}) and SACH.trang_thai = 1`;
    // var sql = `SELECT * FROM users WHERE SACH.ten_sach LIKE '%${stringSearch}%'`
    // console.log(sql);
    return db.load(sql);
}