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