var categoryRepo = require('../repos/categoryRepo');

module.exports = (req, res, next) => {

	if (req.session.isLogged === undefined) {
		req.session.isLogged = false;
	}
    var loaiSach = categoryRepo.loadAllLoaiSach();
    var nhaXuatBan = categoryRepo.loadAllNhaXuatBan();
    Promise.all([loaiSach, nhaXuatBan]).then(([LS, NXB]) => {
        res.locals.layoutVM = {
            categories: LS,
            suppliers: NXB,
            isLogged: req.session.isLogged,
            curUser: req.session.user
        };
        // console.log(res.locals.layoutVM.curUser);
        next();
    });
};