var mysql = require('mysql');


module.exports = {
    connectDatabase: () => {
        var mysql = require('mysql');
        var cn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'ban_sach'
        });
        cn.connect();
        return cn;
    }
}