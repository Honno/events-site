module.exports = function (app) {
    app.use('/', require('./main.js'));
    app.use('/profile', require('./organiser.js'));
    app.use('/events', require('./events.js'));
}
