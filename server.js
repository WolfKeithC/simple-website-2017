var express = require('express')
  , logger = require('morgan')
  , app = express()
  

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
  try {
    var url = require("url");
    var page = url.parse(req.url).pathname;
    console.log(page);

    template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')

    var html = template({ title: 'Home123' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/test', function (req, res, next) {
  try {
    var querystring = require('querystring');
    var url = require("url");
    var page = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;
    var params = querystring.parse(query);
    //console.log(page);
    //var html = template({ title: 'Data' })
    //res.send("<html><body><h1>Hello World!</h1>" + params['firstName'] + "</body></html>")

    template = require('jade').compileFile(__dirname + '/source/templates/test.jade')

    var html = template({ title: 'Test123', firstName : params['firstName'] })

    res.send(html)

  } catch (e) {
    next(e)
  }
})

app.get('/data', function (req, res, next) {
  try {

    // config for your database
    var sql = require("mssql");
    sql.close();
    
    // config for your database
    var config = {
      user: 'callcenter',
      password: 'callcenter',
      server: '10.102.168.22', 
      database: 'KCW',
      port: 1433
    };

    console.log("SQL Connecting");

    // connect to your database
    sql.connect(config, function (err) {
      

      if (err) console.log(err);

      console.log("SQL Connected");
      
      // create Request object
      var request = new sql.Request();
          
      // query to the database and get the records
      request.query('select TOP 20 * from Ticket_Coding_Mapping', function (err, recordset) {
          
          if (err) console.log(err)

          // send records as a response
          //res.send(recordset);

          template = require('jade').compileFile(__dirname + '/source/templates/data.jade')

          var html = template({ title: 'Data', userPosts : recordset })

          /*
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write("<html><table>");
          for (var i = 0; i < recordset.length; i++) {
            res.write("<tr><td>" + recordset[i].DisplayName + "</td><td>" + recordset[i].ApplicationID + "</td></tr>" );
          }
          */

          res.send(html)

          //res.write("</table></html>");
          //res.end("<br />Done.");
      });
    });

    console.log("Done");
    
    //sql.close();

  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})