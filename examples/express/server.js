var express = require('express'),
    swig = require('../../index'),
    app = express.createServer(),
    people;

// Register the template engine
app.register('.html', swig);
//express 3: uncomment under code
//adminHost.engine('html', swig.__express);
app.set('view engine', 'html');

// Set the view directory
swig.init({ root: __dirname + '/views', allowErrors: true });
app.set('views', __dirname + '/views');

// Make sure you aren't using Express's built-in layout extending
// app.set('view options', { layout: false });
app.set('view cache', true);

app.get('/', function (req, res) {
    res.render('index', {});
});

people = [
    { name: 'Paul', age: 28 },
    { name: 'Jane', age: 26 },
    { name: 'Jimmy', age: 45 }
];

app.get('/people', function (req, res) {
    res.render('people', { people: people });
});

app.get('/people/:id', function (req, res) {
    res.render('person', { person: people[req.params.id] });
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');
