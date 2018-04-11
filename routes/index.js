module.exports = function (app) {
    app.use('/', require('./main.js'));
    app.use('/', require('./organiser.js'));
    app.use('/events', require('./events.js'));
}
