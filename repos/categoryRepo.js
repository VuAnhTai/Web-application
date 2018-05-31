var db = require('../fn/db');

exports.loadAllLoaiSach = () => {
    var sql = 'SELECT * FROM bs_loai_sach WHERE id_loai_cha = 0';
    return db.load(sql);
}

exports.loadAllNhaXuatBan = () => {
    var sql = 'SELECT * FROM bs_nha_xuat_ban';
    return db.load(sql);
}