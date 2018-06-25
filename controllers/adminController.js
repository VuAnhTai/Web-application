var express = require('express');
var adminRepo = require('../repos/adminRepo.js');
var exphbs = require('express-handlebars');
var exphbs_section = require('express-handlebars-sections');
var db = require('../fn/db1')

var router = express.Router();


router.get('/', (req, res) => {
    //var pid = req.params.id;
    var SP = adminRepo.loadSanPham();
    
    Promise.all([SP]).then(([SP]) => {
        var vm = {
            san_pham: SP
            
        };
        
        res.render('admin/index', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });
    
});
router.get('/updatePrice/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query("select * from bs_sach where id = ?", [pid], function (err, row) {
        if (err) throw err;
        var vm = {
            san_pham: row[0]
        };
        res.render('admin/updatePrice', {
            data: vm,
            layout: 'admin.handlebars'
        });
    })
});


router.post('/updatePrice/:id', (req, res) => {
    // update categories set CatName = '${category.CatName}' where CatID = ${category.CatID}
    var pid = req.params.id;
    db.connectDatabase().query(`update bs_sach set don_gia = '${req.body.don_gia}' where id = ?`, [pid], function (err, row) {
        if (err) throw err;
        
        res.redirect('/admin');
    })
    
});
router.get('/suspended/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`UPDATE bs_sach SET trang_thai = 0 WHERE id = ?`, [pid], function (err, row) {
        if (err) throw err;
        
        res.redirect('/admin');
    })

});

router.get('/order', (req, res) => {
    //var pid = req.params.id;
    var DH = adminRepo.loadDonHang();
    
    Promise.all([DH]).then(([DH]) => {
        var vm = {
            don_hang: DH
            
        };
        
        res.render('admin/order', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });
    
});

router.get('/updateStatus/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query("select *, DATE_FORMAT(ngay_dat, '%Y-%m-%d') as ngay_dat2 from bs_don_hang where id = ?", [pid], function (err, row) {
        if (err) throw err;
        var vm = {
            don_hang: row[0]
        };
        res.render('admin/updateStatus', {
            data: vm,
            layout: 'admin.handlebars'
        });
    })
});


router.post('/updateStatus/:id', (req, res) => {
    // update categories set CatName = '${category.CatName}' where CatID = ${category.CatID}
    var pid = req.params.id;
    db.connectDatabase().query(`update bs_don_hang set trang_thai = '${req.body.trang_thai}' where id = ?`, [pid], function (err, row) {
        if (err) throw err;
        
        res.redirect('/admin/order');
    })
    
});

module.exports = router;