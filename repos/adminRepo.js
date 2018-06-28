var db = require('../fn/db.js');

exports.loadBook = () => {
	var sql = 'select * from bs_sach';
	return db.load(sql);
}

exports.loadAuthor = () => {
	var sql = 'select * from bs_tac_gia';
	return db.load(sql);
}
exports.loadSanPham = () => {
	var sql = `SELECT R1.id, R1.ten_sach, R3.ten_tac_gia, R4.ten_loai_sach, R2.ten_nha_xuat_ban, R1.don_gia, R1.trang_thai  FROM bs_sach R1 LEFT JOIN bs_nha_xuat_ban R2 ON (R1.id_nha_xuat_ban = R2.id) 
				LEFT JOIN bs_tac_gia R3 ON (R1.id_tac_gia = R3.id) 
				LEFT JOIN bs_loai_sach R4 ON (R1.id_loai_sach = R4.id)`;
	return db.load(sql);
}

exports.loadDonHang = () => {
	var sql = `select *, DATE_FORMAT(ngay_dat, '%Y-%m-%d') as ngay_dat2,(trang_thai-1) as trang_thai2 from bs_don_hang
	ORDER BY ngay_dat2 DESC`;
	return db.load(sql);
}

exports.loadNhaXuatBan = () => {
	var sql = 'select * from bs_nha_xuat_ban';
	return db.load(sql);
}

exports.loadLoaiSach = () => {
	var sql = 'select * from bs_loai_sach';
	return db.load(sql);
}

exports.loadTacGia = () => {
	var sql = 'select * from bs_tac_gia';
	return db.load(sql);
}