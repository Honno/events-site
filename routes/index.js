module.exports = function (app) {
    app.use('/organiser', require('./organiser.js'));
    app.use('/events', require('./events.js'));

    app.get('/', function (req, res) {
        res.send("Hi");
        console.log(req.session.userId);
    });
}
