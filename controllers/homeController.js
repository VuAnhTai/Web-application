var express = require('express');
var categoryRepo = require('../repos/categoryRepo');
var router = express.Router();

router.get('/', (req, res) => {
    var loaiSach = categoryRepo.loadAllLoaiSach();
    var nhaXuatBan = categoryRepo.loadAllNhaXuatBan();
    Promise.all([loaiSach, nhaXuatBan]).then(([LS, NXB]) => {
        var vm = {
            // categories: LS,
            // nhaXuatBan: NXB
        };
        res.render('home/index', vm);
    });
});

module.exports = router;