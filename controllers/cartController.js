var express = require('express');
var moment = require('moment');
var cartRepo = require('../repos/cartRepo'),
    productRepo = require('../repos/productRepo'),
    accountRepo = require('../repos/accountRepo');

var restrict = require('../middle-wares/restrict');

var yyyymmdd = require('yyyy-mm-dd')

var router = express.Router();

router.get('/', restrict, (req, res) => {

    var arr = [];
    var user = accountRepo.loadUser(req.session.user)

    arr.push(user);
    for (var i = 0; i < req.session.cart.length; i++) {
        var cartItem = req.session.cart[i];
        var p = productRepo.single(cartItem.ProId);
        arr.push(p);
    }
    if (req.session.total === undefined) {
		req.session.total = 0;
    }
    var items = [];
    var moneyTotal = 0;
    req.session.total = 0;

    Promise.all(arr).then(result => {

        for (var i = result.length - 1; i >= 1; i--) {
            var pro = result[i][0];

            var item = {
                Product: pro,
                Quantity: req.session.cart[i-1].Quantity,
                Amount: pro.don_gia * req.session.cart[i-1].Quantity
            };

            req.session.total += item.Amount;
            items.push(item);
        }

        var vm = {
            items: items,
            moneyTotal: req.session.total, 
            user: result[0][0]
        };

        res.render('cart/index', {
            data: vm,
            layout: 'main_not_leftbar.handlebars'
        });
    });
});

router.post('/add', (req, res) => {
    var item = {
        ProId: req.body.proId,
        Quantity: +req.body.quantity,
    };
    cartRepo.add(req.session.cart, item);
    res.redirect(req.headers.referer);
});

router.post('/remove', (req, res) => {
    cartRepo.remove(req.session.cart, req.body.proId );
    res.redirect(req.headers.referer);
});

router.post('/payment', (req, res) => {
    var time = new Date();
    var ngay_dat = moment(time, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm');
    var trang_thai = 0;

    //lấy id user
    accountRepo.loadUser(req.session.user).then(rows => {
        order = {
            tong_tien: req.session.total,
            ngay_dat: ngay_dat,
            id_nguoi_dung: rows[0].id,
            ho_ten_nguoi_nhan: req.body.ho_ten_nguoi_nhan,
            email_nguoi_nhan: req.body.email_nguoi_nhan,
            so_dien_thoai_nguoi_nhan: req.body.so_dien_thoai_nguoi_nhan,
            trang_thai: trang_thai,
            dia_chi_nguoi_nhan: req.body.dia_chi_nguoi_nhan
        }
        // add du lieu vo bang bs_don_hang => lay id truyen cho viec tiep theo
        var cart = req.session.cart;
        cartRepo.addOrder(order).then(value => {
            var arr = [];
            for (var i = 0; i < cart.length; i++) {
                var cartItem = cart[i];
                var p = productRepo.single(cartItem.ProId);
                arr.push(p);
            }
            //chuẩn bị dữ liệu add vo order_detail
            var items = [];
            Promise.all(arr).then(result => {
                for (var i = result.length - 1; i >= 0; i--) {
                    var item = {
                        id_don_hang: value.insertId,
                        id_sach: cart[i].ProId,
                        so_luong: cart[i].Quantity,
                        don_gia: result[i][0].don_gia,
                        thanh_tien: cart[i].Quantity * result[i][0].don_gia
                    };
                    //cap nhat so luong ton, so luong ban
                    newSLT = result[i][0].so_luong_ton - item.so_luong;
                    newSLB = result[i][0].sl_ban + item.so_luong;

                    updateSL = productRepo.updateSL(item.id_sach, newSLT, newSLB)
                    items.push(updateSL);
                    
                    orderDetail = cartRepo.addOrderDetail(item);
                    items.push(orderDetail);
                }
                //add du lieu vo order_detail
                Promise.all(items).then(result_order_detail => {
                    //delete toan bo cart sau khi hoan thanh
                    req.session.cart = undefined;
                    res.redirect(req.headers.referer);
                });
            });
        });
    })

    // console.log(time);
    
});

router.get('/history', (req, res) => {
    accountRepo.loadUser(req.session.user).then(rows => {
        $id_nguoi_dung = rows[0].id;
        cartRepo.loadOrder($id_nguoi_dung).then(orders => {
            order = [];
            //load all order cua nguoi dung
            for (var i = orders.length - 1; i >= 0; i--) {
                idOrder = orders[i].id;
                proInOrder = cartRepo.loadOrderDetail(idOrder);
                order.push(proInOrder);
            }
            //cau hinh data gui cho client
            data = [];
            Promise.all(order).then(result => {
                // console.log(orders);
                for (var j = result.length - 1, i = 0; j >= 0, i < result.length - 1; j--, i++) {
                    var order = {
                        items: result[i],
                        time: yyyymmdd(orders[j].ngay_dat),
                        total: orders[j].tong_tien,
                        trang_thai: orders[j].trang_thai,
                        trang_thai2: orders[j].trang_thai2,
                    }
                    // console.log(result[i][0].id_don_hang);
                    // console.log(orders[j].id);
                    console.log(order);
                    data.push(order);
                }
                var vm = {
                    orders: data
                }
                
                // console.log(vm);
                res.render('cart/history', {
                    data: vm,
                    layout: 'main_not_leftbar.handlebars',
                });
            });
        });
    });
})
module.exports = router;
