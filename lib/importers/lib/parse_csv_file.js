var csv = require('csv');
var fs = require('fs');
var Promise = require('sequelize').Promise;

var parse_csv_file = function(file_object) {
  return new Promise(function (resolve, reject) {
    var parser = csv.parse({delimiter: ',', columns: true, autoParse: true},
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
        parser.end();
      });
    fs.createReadStream(file_object.path).pipe(parser);
  });
};

module.exports = parse_csv_file;