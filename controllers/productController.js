var express = require('express');
var productRepo = require('../repos/productRepo');
var config = require('../config/config');

var router = express.Router();

router.get('/byCat/:catId', (req, res) => {
    var catId = req.params.catId;
    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadAllByCat(catId, offset);
    var p2 = productRepo.countByCat(catId);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {
        // console.log(pRows);

        var total = countRows[0].total;

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
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
        };
        res.render('product/product', vm);
    });
});

router.get('/bySup/:supId', (req, res) => {
    var supId = req.params.supId;

    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    // console.log(config.PRODUCTS_PER_PAGE);
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    var p1 = productRepo.loadAllBySup(supId, offset);
    var p2 = productRepo.countBySup(supId);
    Promise.all([p1, p2]).then(([pRows, countRows]) => {
        // console.log(pRows);
        // console.log(countRows);

        var total = countRows[0].total;

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
            products: pRows,
            noProducts: pRows.length === 0,
            page_numbers: numbers,
            // errorMsg: 'Không tìm thấy sản phẩm của nhà sản xuất'

        };
        res.render('product/product', vm);
    });
});

router.get('/detail/:id', (req, res) => {
    var proId = req.params.id;


    // res.render('product/detail');

    productRepo.single(proId).then(rows => {
        if (rows.length > 0) {
            offset = Math.floor(Math.random() * 10) * 8;  
            
            var p1 = productRepo.loadByCat(rows[0].id_loai_sach);
            var p2 = productRepo.loadBySup(rows[0].id_nha_xuat_ban);
            var p3 = productRepo.loadAllProduct(offset);
            Promise.all([p1, p2, p3]).then(([cat, sup, all]) => {
                // console.log(cat.length);
                var cats = [];
                var sups = [];
                var exists = [];
                var arrRandom=[];
                console.log(sup.length);
                console.log(cat.length);
                if(cat.length >= 5){
                    for(var l = 0; l < 5; l++) {
                       do {
                           randomNumber = Math.floor(Math.random() * cat.length);  

                       } while (exists[randomNumber]);
                       exists[randomNumber] = true;
                       cats.push(cat[randomNumber]);
                    }
                }else{
                    cats = cat;
                    var arrRandom=[];
                    for(var l = cat.length; l < 5; l++) {
                        do {
                            randomNumber = Math.floor(Math.random() * 8);  
                            console.log(randomNumber);
                        } while (arrRandom.includes(randomNumber));

                        arrRandom.push(randomNumber);

                        cats.push(all[randomNumber]);
                        
                    }
                }
                // console.log(sup.length);
                exists = []; arrRandom = [];
                if(sup.length >= 5){
                    for(var l = 0; l < 5; l++) {
                        do {
                            randomNumber = Math.floor(Math.random() * sup.length);  
 
                        } while (exists[randomNumber]);
                        exists[randomNumber] = true;
                        sups.push(sup[randomNumber]);
                    }
                }else{
                    sups = sup;
                    for(var l = sup.length; l < 5; l++) {
                        do {
                            randomNumber = Math.floor(Math.random() * 8); 
                            console.log(randomNumber);
                        } while (arrRandom.includes(randomNumber));

                        arrRandom.push(randomNumber);

                        sups.push(all[randomNumber]);
                        
                    }
                    // console.log(sups);
                }
                
                var vm = {
                    product: rows[0],
                    productsByCat: cats,
                    productsBySup: sups
                }
                res.render('product/detail', vm);

            });
        } else {
            res.redirect('/');
        }
    });
});

router.get('/search', (req, res) => {
    var keyword = req.query.Search;
    var page = req.query.page;
    if (!page) {
        page = 1;
    }
    var offset = (page - 1) * config.PRODUCTS_PER_PAGE;

    productRepo.search(keyword, offset).then(rows => {
        total = rows.length;

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
            products: rows,
            noProducts: rows.length === 0,
            page_numbers: numbers,
            // errorMsg: 'Không tìm thấy sản phẩm'
        };
        res.render('product/product', vm);
    });
})
module.exports = router;
