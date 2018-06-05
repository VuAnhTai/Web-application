var db = require('../fn/db');

exports.loadAllLoaiSach = () => {
    var sql = 'SELECT * FROM bs_loai_sach WHERE id_loai_cha = 0';
    return db.load(sql);
}

exports.loadAllNhaXuatBan = () => {
    var sql = 'SELECT * FROM bs_nha_xuat_ban';
    return db.load(sql);
}
exports.loadSanPhamBanChay = () => {
    var sql ='SELECT * FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id order by R1.sl_ban DESC limit 0,10';
    return db.load(sql);
}
exports.loadSanPhamMoiNhat = () => {
    var sql ='SELECT * FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id order by R1.ngay_tiep_nhan DESC limit 0,10';
    return db.load(sql);
}
exports.loadSanPhamXemNhieu = () => {
    var sql ='SELECT * FROM `bs_sach` R1, `bs_tac_gia` R2 where R1.id_tac_gia = R2.id order by R1.luot_xem DESC limit 0,10';
    return db.load(sql);
}