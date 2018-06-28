var db = require('../fn/db');
var config = require('../config/config');

exports.loadAllLoaiSach = () => {
    var sql = 'SELECT * FROM bs_loai_sach WHERE id_loai_cha = 0';
    return db.load(sql);
}

exports.loadAllNhaXuatBan = () => {
    var sql = 'SELECT * FROM bs_nha_xuat_ban';
    return db.load(sql);
}

exports.loadAllProduct= (offset) => {
    var sql = `SELECT bs_sach.*, bs_tac_gia.ten_tac_gia 
        FROM bs_sach, bs_tac_gia 
        WHERE bs_sach.id_tac_gia = bs_tac_gia.id and bs_sach.trang_thai = 1
        limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countAllProduct = () => {
    var sql = `select count(*) as total from bs_sach, bs_tac_gia WHERE bs_sach.id_tac_gia = bs_tac_gia.id and bs_sach.trang_thai = 1`;
    return db.load(sql);
}

exports.loadSanPhamBanChay = () => {	
    var sql ='SELECT R1.*, r2.ten_tac_gia FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id and R1.trang_thai = 1 order by R1.sl_ban DESC limit 0,10';	
    return db.load(sql);	
}	
exports.loadSanPhamMoiNhat = () => {	
    var sql ='SELECT R1.*, r2.ten_tac_gia FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id and R1.trang_thai = 1 order by R1.ngay_tiep_nhan DESC limit 0,10';	
    return db.load(sql);	
}	
exports.loadSanPhamXemNhieu = () => {	
    var sql ='SELECT R1.*, r2.ten_tac_gia FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id and R1.trang_thai = 1 order by R1.luot_xem DESC limit 0,10';	
    return db.load(sql);
}