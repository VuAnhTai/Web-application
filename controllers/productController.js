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
            page_numbers: numbers
        };
        res.render('product/byCat', vm);
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
            page_numbers: numbers
        };
        res.render('product/bySup', vm);
    });
});

router.get('/detail/:id', (req, res) => {
    var proId = req.params.id;


    // res.render('product/detail');

    productRepo.single(proId).then(rows => {
        if (rows.length > 0) {
            var p1 = productRepo.loadByCat(rows[0].id_loai_sach);
            var p2 = productRepo.loadBySup(rows[0].id_nha_xuat_ban);
            Promise.all([p1, p2]).then(([cat, sup]) => {
                var vm = {
                    product: rows[0],
                    productsByCat: cat,
                    productsBySup: sup
                }
                // console.log(vm.productsByCat);s
                res.render('product/detail', vm);

            });
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
