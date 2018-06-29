var express = require('express'),
    md5 = require('md5'),
    moment = require('moment');
var request = require('request');

var accountRepo = require('../repos/accountRepo');
var restrict = require('../middle-wares/restrict');

var router = express.Router();

router.get('/register', (req, res) => {
    res.render('account/register',{layout: 'main_not_leftbar.handlebars'});
});

router.post('/register', (req, res) => {
      if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msg":"Please select captcha"});
  }

  // Secret Key
  const secretKey = '6LdgDVYUAAAAABw1DKKvcGSbHrUap7CaFd5z_eug';

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make Request To VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    // console.log(req.body);

    // If Not Successful
    if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msg":"Failed captcha verification"});
    }

    //If Successful
    showError: false;
    var dob = moment(req.body.dob, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm');

    var user = {
        username: req.body.username,
        password: md5(req.body.password).toString(),
        name: req.body.name,
        email: req.body.email,
        dob: dob,
    };
    accountRepo.add(user).then(value => {
        req.session.isLogged = true;
        req.session.user = req.body.username;
        return res.json({"success": true, "msg":"Registered success"});
        
    }).catch(err => {
        return res.json({"success": false, "msg":"Register failure"});
    //     var vm = {
    //         showError: true,
    //         errorMsg: 'Register failed'
    //     };
    //     res.render('account/register', {
    //         data: vm,
    //         layout: 'main_not_leftbar.handlebars'
    //     });
    });
    
  });
});

router.get('/login', (req, res) => {
    res.render('account/login', {layout: 'main_not_leftbar.handlebars'});
});

router.post('/login', (req, res) => {
    var user = {
        username: req.body.username,
        password: md5(req.body.password).toString()
    };

    accountRepo.login(user).then(rows => {
        if (rows.length > 0) {
            // user = rows[0];
            if(rows[0].id_loai_user >= 6){
                req.session.admin = true;
            }

            req.session.isLogged = true;
            req.session.user = req.body.username;
            var url = '/';
            if (req.query.retUrl) {
                url = req.query.retUrl;
            }

            res.redirect(url);
        } else {
            var vm = {
                showError: true,
                errorMsg: 'Login failed'
            };
            res.render('account/login', {
                data: vm,
                layout: 'main_not_leftbar.handlebars'
            });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.isLogged = false;
    req.session.user = undefined;
    req.session.admin = undefined;
    req.session.cart = undefined;
    res.redirect(req.headers.referer);
});

router.get('/profile', restrict, (req, res) => {

    accountRepo.loadUser(req.session.user).then(rows => {
        vm = {
            user: rows[0]
        }
        // console.log(vm);
        res.render('account/profile',  {
            data: vm,
            layout: 'main_not_leftbar.handlebars'
        });
    });
});

router.post('/update', restrict, (req, res) => {

    var user = {
        tai_khoan: req.session.user,
        ho_ten: req.body.ho_ten,
        so_dien_thoai: req.body.so_dien_thoai,
        dia_chi: req.body.dia_chi,
        email: req.body.email, 
        ngay_sinh: req.body.dob
    };

    accountRepo.updateUser(user).then(value => {
        res.redirect(req.headers.referer);
    });
});

module.exports = router;