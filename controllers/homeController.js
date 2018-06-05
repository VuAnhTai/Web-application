var express = require('express');
var categoryRepo = require('../repos/categoryRepo');
var router = express.Router();

router.get('/', (req, res) => {
    var top_sp = categoryRepo.loadSanPhamBanChay();
    var sp_moi = categoryRepo.loadSanPhamMoiNhat();
    var sp_xem_nhieu_nhat = categoryRepo.loadSanPhamXemNhieu();
    Promise.all([top_sp, sp_moi, sp_xem_nhieu_nhat]).then(([top_sp, sp_moi, sp_xem_nhieu_nhat]) => {
        var vm = {
            // categories: LS,
            // nhaXuatBan: NXB
            top_san_pham: top_sp,
            sp_moi_nhat: sp_moi,
            sp_xem_nhieu: sp_xem_nhieu_nhat

        };
        res.render('home/index', vm);
    });
});

module.exports = router;