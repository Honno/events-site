module.exports = function (app) {
    app.use('/', require('./main.js'));
    app.use('/', require('./organiser.js'));
    app.use('/', require('./events.js'));
}
