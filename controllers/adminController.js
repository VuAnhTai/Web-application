var express = require('express');
var adminRepo = require('../repos/adminRepo.js');
var exphbs = require('express-handlebars');
var exphbs_section = require('express-handlebars-sections');

var router = express.Router();

// app.engine('hbs', exphbs({
//     defaultLayout: 'admin',
//     layoutsDir: 'views/layouts/',
//     helpers: {
//     	section: exphbs_section()
//     }
// }));

router.get('/', (req, res) => {
	res.render('admin/index', {
        layout: 'admin.handlebars',  helpers: {
        section: exphbs_section()
        }
	});
});
router.get('/list', (req, res) => {
	adminRepo.loadBook().then(book =>{
		adminRepo.loadAuthor().then(author =>{
			var vm = {
				authors: author,
				books: book
			};
			res.render('admin/listBook', 
		    {
				data : vm, 
				layout : 'admin.handlebars',
				helpers: {
					section: exphbs_section()
				}
			})
		});
	});
});
// router.get('/list', (req, res) => {
// 	adminRepo.loadBook().then(rows => {
//         var vm = {
//             books: rows
//         };
//         res.render('admin/listBook', 
//         {
//     		data : vm, 
//     		layout : 'admin.handlebars',
//     		helpers: {
//     			section: exphbs_section()
//     		}
//     	})
//     });
// });
router.get('/add', (req, res) => {
    res.render('admin/addBook', {
        layout: 'admin.handlebars',  helpers: {
        section: exphbs_section()
        }
	});
});


module.exports = router;