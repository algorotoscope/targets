const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });


    connection.connect(function(err) {
      if (err) throw err;

      var sql = "SELECT * FROM targets_tags WHERE target_id = " + event.target_id + " and tag_id = " + event.tag_id + " LIMIT 1";
      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        if(result && result.length > 0){
          callback( null, result[0] ); 
          connection.end();
        }
        else{

          var sql = "INSERT INTO targets_tags(target_id,tag_id) VALUES(" + event.target_id + ", " + event.tag_id + ")";
        
          connection.query(sql, function (error, results, fields) {

            var inserted = {};
            inserted.id = results.insertId;
            inserted.target_id = event.target_id;
            inserted.tag_id = event.tag_id;
        
            callback( null, inserted );
            connection.end();
      
          });          

        }
      });
    });
});