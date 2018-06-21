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
// router.post('/register', (req, res) => {
//     if(
//     req.body.captcha === undefined ||
//     req.body.captcha === '' ||
//     req.body.captcha === null
//   ){
//     return res.json({"success": false, "msg":"Please select captcha"});
//   }
//   // console.log(req.body.captcha);
//   // Secret Key
//   const secretKey = '6LdXE2AUAAAAAFkiF7gtfEKw1DqGMDCbkX-EcrRI';

//   // Verify URL
//   const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

//   // Make Request To VerifyURL
//   request(verifyUrl, (err, response, body) => {
//     body = JSON.parse(body);
//     console.log(body);

//     // If Not Successful
//     if(body.success !== undefined && !body.success){
//       return res.json({"success": false, "msg":"Failed captcha verification"});
//     }

//     //If Successful
//     return res.json({"success": true, "msg":"Captcha passed"});
//   });
// });

// router.post('/register', (req, res) => {
//     showError: false
    // var dob = moment(req.body.dob, 'D/M/YYYY').format('YYYY-MM-DDTHH:mm');

    // var user = {
    //     username: req.body.username,
    //     password: md5(req.body.password).toString(),
    //     name: req.body.name,
    //     email: req.body.email,
    //     dob: dob,
    // };
    // accountRepo.add(user).then(value => {
    //     res.redirect('/home');

    // }).catch(err => {
    //     var vm = {
    //         showError: true,
    //         errorMsg: 'Register failed'
    //     };
    //     res.render('account/register', {
    //         data: vm,
    //         layout: 'main_not_leftbar.handlebars'
    //     });
    // });
// });

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

            req.session.isLogged = true;
            req.session.user = req.body.username;
            res.redirect('/');

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
    req.session.user = null;
    res.redirect(req.headers.referer);
});
router.get('/profile', restrict, (req, res) => {
    res.render('account/profile');
});

module.exports = router;