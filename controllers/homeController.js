var express = require('express');
var categoryRepo = require('../repos/categoryRepo');
var config = require('../config/config');

var router = express.Router();

router.get('/', (req, res) => {
	var page = req.query.page;
    if (!page) {
        page = 1;
    }
    
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;
    var pro = categoryRepo.loadAllProduct(offset);
    var countPro = categoryRepo.countAllProduct();
    var top_sp = categoryRepo.loadSanPhamBanChay();
    var sp_moi = categoryRepo.loadSanPhamMoiNhat();
    var sp_xem_nhieu_nhat = categoryRepo.loadSanPhamXemNhieu();	
    Promise.all([pro, countPro, top_sp, sp_moi, sp_xem_nhieu_nhat]).then(([pro, countPro, top_sp, sp_moi, sp_xem_nhieu_nhat]) => {
        var total = countPro[0].total;

        var nPages = total / config.PRODUCTS_PER_PAGE;
        
        if (total % config.PRODUCTS_PER_PAGE > 0) {
            nPages++;
        }

        var numbers = [];
        for (i = 1; i <= nPages; i++) {
            numbers.push({
                value: i,
                isCurPage: i === +page
            });
        }

        var vm = {
        	products: pro,
            page_numbers: numbers,
          	top_san_pham: top_sp,	
            sp_moi_nhat: sp_moi,	
            sp_xem_nhieu: sp_xem_nhieu_nhat
        };
        // console.log(vm.products);
        res.render('home/index', vm);
    });
});


module.exports = router;