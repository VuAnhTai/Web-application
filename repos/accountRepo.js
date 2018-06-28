var db = require('../fn/db');

exports.add = user => {
    var sql = `insert into bs_nguoi_dung(tai_khoan, mat_khau, ho_ten, email, ngay_sinh) 
    values('${user.username}', '${user.password}', '${user.name}', '${user.email}', '${user.dob}')`;
    return db.save(sql);
}

exports.login = user => {
    var sql = `select * from bs_nguoi_dung where tai_khoan = '${user.username}' and mat_khau = '${user.password}'`;
    return db.load(sql);
}

exports.loadUser = username => {
    var sql = `select *, DATE_FORMAT(ngay_sinh, '%Y-%m-%d') as dob from bs_nguoi_dung where tai_khoan = '${username}'`;    
    return db.load(sql);
}

exports.updateUser = user => {
    var sql = `UPDATE bs_nguoi_dung SET ho_ten='${user.ho_ten}', email='${user.email}', ngay_sinh='${user.ngay_sinh}', dia_chi='${user.dia_chi}', dien_thoai='${user.so_dien_thoai}' WHERE tai_khoan = '${user.tai_khoan}'`;
    return db.save(sql);
}