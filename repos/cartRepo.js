var db = require('../fn/db');

//xu ly khong dung toi database
exports.add = (cart, item) => {
    if(cart.length === 0){
        cart.push(item);
    }else{
        for (i = cart.length - 1; i >= 0; i--) {
            if (cart[i].ProId === item.ProId) {
                cart[i].Quantity += item.Quantity;
                return;
            }
        }
        cart.push(item);
    }
}

exports.remove = (cart, proId) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        if (proId === cart[i].ProId) {
            cart.splice(i, 1);
            return;
        }
    }
}

exports.addOrder = order => {
    var sql = `INSERT INTO bs_don_hang(tong_tien, ngay_dat, id_nguoi_dung, ho_ten_nguoi_nhan, email_nguoi_nhan, so_dien_thoai_nguoi_nhan, trang_thai, dia_chi_nguoi_nhan) 
                                VALUES ('${order.tong_tien}','${order.ngay_dat}',${order.id_nguoi_dung},'${order.ho_ten_nguoi_nhan}','${order.email_nguoi_nhan}',
                                    '${order.so_dien_thoai_nguoi_nhan}',${order.trang_thai},'${order.dia_chi_nguoi_nhan}')`;
    return db.save(sql);
}

exports.addOrderDetail = orderDetail => {
    var sql = `INSERT INTO bs_chi_tiet_don_hang(id_don_hang, id_sach, so_luong, don_gia, thanh_tien) 
                    VALUES (${orderDetail.id_don_hang},${orderDetail.id_sach},${orderDetail.so_luong},${orderDetail.don_gia},${orderDetail.thanh_tien})`;
    console.log(sql);
    return db.save(sql);
}

exports.loadOrder = id_nguoi_dung => {
    var sql = `SELECT *, (trang_thai-1) as trang_thai2 FROM bs_don_hang WHERE id_nguoi_dung = ${id_nguoi_dung}`;
    console.log(sql);
    return db.save(sql);
}

exports.loadOrderDetail = $idOrder => {
    var sql = `SELECT CTDH.id_sach, CTDH.don_gia, CTDH.so_luong, CTDH.thanh_tien, SACH.ten_sach, SACH.hinh, CTDH.id_don_hang 
                FROM bs_chi_tiet_don_hang as CTDH 
                LEFT JOIN bs_sach as SACH on SACH.id = CTDH.id_sach 
                WHERE CTDH.id_don_hang = ${idOrder}`;
    return db.load(sql);

}