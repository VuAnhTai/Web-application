module.exports = (req, res, next) => {
    if (req.session.admin === true) {
        next();
    } else {
        if (req.session.isLogged === true){
            req.session.isLogged = false;
            req.session.user = null;
        }
        res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    }
}