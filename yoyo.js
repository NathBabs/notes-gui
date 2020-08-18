const static = require('node-static');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { addNote, removeNotes, listNotes, readNote, deleteDir  } = require('./notes');
const { displayNotes } = require('./test');

const fileServer = new static.Server('./public');
 
const server = http.createServer((req, res) => {
    fileServer.serve(req, res, function(e, resp) {
        const reqUrl = url.parse(req.url).pathname;
    //compare our request method
        if(req.method == 'GET'){
            if (reqUrl == '/'){
                fileServer.serveFile('/index.html', 200, {}, req, res);
            }else if (reqUrl == '/notes'){
                fileServer.serveFile('/notes.html', 200, {}, req, res);
            }else if (reqUrl == '/listnotes') {
                const noteObj = listNotes();
                const notes = displayNotes(noteObj);
                console.log(notes);
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify(notes));
            }
        } else if (req.method == 'POST'){
            if (reqUrl == '/note') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    //let parsedData = querystring.decode(body); 
                    let stringData = JSON.parse(body);
                    let note = addNote(stringData.directory, stringData.title, stringData.body);
                    console.log(stringData);
                    //res.write()
                    res.end(note);
                });
            }
        }
    });
    
    });

    server.listen(8080);