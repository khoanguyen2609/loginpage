var q = require('q');
var db= require("../common/database");

var connection = db.getConnection();

function addUser(user) {
  if (user) {
    var defer = q.defer();
    var query = connection.query('INSERT INTO users SET ?', user, function (error, results) {
      if (error) {
        defer.reject(error);
      } else {
        defer.resolve(results);
      }
      });
      console.log(query.sql);
    return defer.promise;
  }
  return false;
}

function getUserByEmail (email, callback) {
  if (email) {
    var defer = q.defer();
    var query = connection.query("SELECT * FROM users WHERE `email` = ?", email , function (error,results) {
    if (error) {
      defer.reject(error);
    } else {
      defer.resolve(results);
    }
  });
  return defer.promise;
};
  console.log(query.sql);
  return false;
  //console.log(query.results);
};

module.exports = {
  addUser: addUser,
  getUserByEmail: getUserByEmail
}
