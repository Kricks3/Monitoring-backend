const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/players', (request, responce) => {
//    responce.sendFile(__dirname + '/players.json');
    var http = require('http');
    var url = '127.0.0.1:8000';
    http.get({
        host: '127.0.0.1',
        port: 8000,
        method: 'GET'
    },(res)=>{
    let body = '';
    res.on('data',(elem) => body +=elem);
    res.on('end',() => {console.log(body); responce.send(body)});
    });
    //responce.send(url);
});

app.post('/player', function (req, res, next) {
    console.log(req.body.name);
    setTimeout(() => {
        const name = req.body.name;
        const test = fs.readFileSync('players.json', 'utf8');
        const summary = JSON.parse(test);
        const maxId = summary.players.reduce((prev, cur) => {
            if (prev.id > cur.id) {
                return prev
            }
            return cur
        });
        const newFile = summary.players.concat({
            id: maxId.id+1,
            name: name
        });
        summary.players = newFile;
        fs.writeFileSync('players.json', JSON.stringify(summary));
        res.send('File players list was rewrite');
        }
        ,2000
    );
});

app.post('/update-player', function (req, res, next) {
    setTimeout(() => {
            const id = req.body.id;
            const name = req.body.name;
            const test = fs.readFileSync('players.json', 'utf8');
            const summary = JSON.parse(test);
            summary.players.forEach((player) => {
                if(player.id === id) player.name = name;
            });
            fs.writeFileSync('players.json', JSON.stringify(summary));
            res.send('File players list was rewrite');
        }
        ,2000
    );
});

app.delete('/player', function (req, res, next) {
    setTimeout(() => {
            const id = req.body.id;
            const test = fs.readFileSync('players.json', 'utf8');
            console.log(req.body);
            const summary = JSON.parse(test);
            const newList = summary.players.filter((player) => {
               return player.id !== id;
            });
            fs.writeFileSync('players.json', JSON.stringify({players: newList}));
            res.send('File players list was rewrite');
        }
        ,2000
    );
});


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});