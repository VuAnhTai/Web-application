var categoryRepo = require('../repos/categoryRepo');

module.exports = (req, res, next) => {

	if (req.session.isLogged === undefined) {
		req.session.isLogged = false;
	}
    if (req.session.cart === undefined) {
        req.session.cart = [];
    }

    var numberItems = 0;
    var cart = req.session.cart
    if(cart.length === 0){
        numberItems = 0;
    }else{
        for (i = cart.length - 1; i >= 0; i--) {
            numberItems += cart[i].Quantity;
        }
    }
    var loaiSach = categoryRepo.loadAllLoaiSach();
    var nhaXuatBan = categoryRepo.loadAllNhaXuatBan();
    Promise.all([loaiSach, nhaXuatBan]).then(([LS, NXB]) => {
        res.locals.layoutVM = {
            categories: LS,
            suppliers: NXB,
            isLogged: req.session.isLogged,
            curUser: req.session.user,
            numberItems: numberItems
        };
        // console.log(res.locals.layoutVM.curUser);
        next();
    });
};

