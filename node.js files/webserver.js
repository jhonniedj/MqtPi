var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if (q.pathname === "/") { filename = "./index.html"; }//root
    console.log("q.pathname:" + q.pathname + " ==> filename:" + filename);
    if (!fs.existsSync(filename)) { filename = "./index.html"; console.log("cant find " + q.pathname + " ==> home"); }
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        if (filename.search(".php")) { res.writeHead(200, { 'Content-Type': 'text/html' }); }
        if (filename.search(".html")) { res.writeHead(200, { 'Content-Type': 'text/html' }); }
        res.write(data);
        return res.end();
    });
}).listen(80); 