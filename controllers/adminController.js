var express = require('express');
var adminRepo = require('../repos/adminRepo.js');
var exphbs = require('express-handlebars');
var exphbs_section = require('express-handlebars-sections');
var db = require('../fn/db1')

var router = express.Router();
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Public/images_sach/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true)
    else {
        req.fileValidationError = 'Error! Wrong mimetype picture of product ( just .jpg and .png only). Please reup the product';
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
};
var upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.get('/addProduct', (req, res) => {
    //var pid = req.params.id;
    var NXB = adminRepo.loadNhaXuatBan();
    var LS = adminRepo.loadLoaiSach();
    var SP = adminRepo.loadSanPham();
    var TG = adminRepo.loadTacGia();
    
    Promise.all([NXB, LS, SP, TG]).then(([NXB, LS, SP, TG]) => {
        var vm = {
            san_pham: SP,
            nha_xuat_ban: NXB,
            loai_sach: LS,
            tac_gia: TG,
        };
        
        res.render('admin/addProduct', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });
    
});
router.get('/', (req, res) => {
    //var pid = req.params.id;
    var NXB = adminRepo.loadNhaXuatBan();
    var LS = adminRepo.loadLoaiSach();
    var SP = adminRepo.loadSanPham();
    var TG = adminRepo.loadTacGia();
    
    Promise.all([NXB, LS, SP, TG]).then(([NXB, LS, SP, TG]) => {
        var vm = {
            san_pham: SP,
            nha_xuat_ban: NXB,
            loai_sach: LS,
            tac_gia: TG,
        };
        
        res.render('admin/updateProduct', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });
    
});
router.get('/home', (req, res) => {
    //var pid = req.params.id;
    var NXB = adminRepo.loadNhaXuatBan();
    
    Promise.all([NXB]).then(([NXB]) => {
        var vm = {
            nha_xuat_ban: NXB,
        };
        
        res.render('admin/home', {
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
        
        res.redirect('/admin/updateProduct');
    })
    
});

router.post('/', upload.single('hinh'), (req, res) => {
    // console.log(req.file.originalname);
    var NXB = adminRepo.loadNhaXuatBan();
    var LS = adminRepo.loadLoaiSach();
    Promise.all([NXB, LS]).then(([NXB, LS]) => {
        db.connectDatabase().query(`insert into bs_sach(ten_sach, gioi_thieu, id_loai_sach, id_nha_xuat_ban, luot_xem, ngay_tiep_nhan, sl_ban, so_luong_ton, trang_thai, hinh, don_gia, id_tac_gia) values ('${req.body.ten_sach}', '${req.body.gioi_thieu}', '${req.body.id_loai_sach}', '${req.body.id_nha_xuat_ban}', '${req.body.luot_xem}', '${req.body.ngay_tiep_nhan.split("/").reverse().join("-")}', '${req.body.sl_ban}', '${req.body.so_luong_ton}', 1, '${req.file.originalname}', '${req.body.don_gia}', '${req.body.id_tac_gia}')`);
        res.redirect('/admin');
    });
});

router.get('/Publisher', (req, res) => {
    //var pid = req.params.id;
    var NXB = adminRepo.loadNhaXuatBan();
    Promise.all([NXB]).then(([NXB]) => {
        var vm = {
            nha_xuat_ban: NXB
        };

        res.render('admin/Publisher', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });

});
router.get('/updatePublisher', (req, res) => {
    //var pid = req.params.id;
    var NXB = adminRepo.loadNhaXuatBan();
    Promise.all([NXB]).then(([NXB]) => {
        var vm = {
            nha_xuat_ban: NXB
        };

        res.render('admin/updatePublisher', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });

});
router.get('/updatePS/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query("select * from bs_nha_xuat_ban where id = ?", [pid], function (err, row) {
        if (err) throw err;
        var vm = {
            nha_xuat_ban: row[0]
        };
        res.render('admin/updatePS', {
            data: vm,
            layout: 'admin.handlebars'
        });
    })
});

router.post('/updatePS/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`update bs_nha_xuat_ban set ten_nha_xuat_ban = '${req.body.ten_nha_xuat_ban}', dia_chi = '${req.body.dia_chi}', dien_thoai = '${req.body.dien_thoai}', email = '${req.body.email}' where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/updatePublisher');
    })
});

router.get('/Publisher/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`delete from bs_nha_xuat_ban where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/updatePublisher');
    })
});

router.post('/Publisher/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`delete from bs_nha_xuat_ban where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/Publisher');
    })
});


router.post('/Publisher', (req, res) => {
    db.connectDatabase().query(`insert into bs_nha_xuat_ban(ten_nha_xuat_ban, dia_chi, dien_thoai, email) values ('${req.body.ten_nha_xuat_ban}', '${req.body.dia_chi}', '${req.body.dien_thoai}', '${req.body.email}')`, function (err, row) {
        if (err) throw err;
        res.redirect('/admin/Publisher');
    })
});

router.get('/KindOfBook', (req, res) => {
    //var pid = req.params.id;
    var LS = adminRepo.loadLoaiSach();
    var LSC = adminRepo.loadLoaiSachCha();
    Promise.all([LS, LSC]).then(([LS, LSC]) => {
        var vm = {
            loai_san_pham: LS,
            loai_san_pham_cha: LSC
        };

        res.render('admin/KindOfBook', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });

});
router.get('/updateKindOfBook', (req, res) => {
    //var pid = req.params.id;
    var LS = adminRepo.loadLoaiSach();
    Promise.all([LS]).then(([LS]) => {
        var vm = {
            loai_san_pham: LS
        };

        res.render('admin/updateKindOfBook', {
            data: vm,
            layout: 'admin.handlebars'
        });
    });

});
router.get('/updateKOB/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query("select * from bs_loai_sach where id = ?", [pid], function (err, row) {
        if (err) throw err;
        var vm = {
            loai_san_pham: row[0]
        };
        res.render('admin/updateKOB', {
            data: vm,
            layout: 'admin.handlebars'
        });
    })
});

router.post('/updateKOB/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`update bs_loai_sach set ten_loai_sach = '${req.body.ten_loai_sach}' where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/updateKindOfBook');
    })
});

router.get('/KindOfBook/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`delete from bs_loai_sach where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/updateKindOfBook');
    })
});

router.post('/KindOfBook/:id', (req, res) => {
    var pid = req.params.id;
    db.connectDatabase().query(`delete from bs_loai_sach where id = ?`, [pid], function (err, row) {
        if (err) throw err;

        res.redirect('/admin/updateKindOfBook');
    })
});


router.post('/KindOfBook', (req, res) => {
    db.connectDatabase().query(`insert into bs_loai_sach(ten_loai_sach,trang_thai, id_loai_cha) values ('${req.body.ten_loai_sach}', 1, '${req.body.id_loai_cha}')`, function (err, row) {
        if (err) throw err;
        res.redirect('/admin/KindOfBook');
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
        console.log(vm);
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