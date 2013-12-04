var express = require('express'),
    app = express();
    
app.use(express.logger());
app.use('/',express.static(__dirname+'/app/public'));
app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

app.get('/hello', function(req, res){
    res.send('<html><body><h1>Hello World</h1></body></html>');
});