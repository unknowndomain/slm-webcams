var express = require('express'),
    _ = require("underscore"),
    swig = require("swig");

module.exports = {
    "title": "Webcam",
    "name": "webcam",
    "app": function membership (config, db, site) {
        var app = express();
        _.extend(app.locals, site.locals);
        
        app.set('views', __dirname + "/views");
        
        site.use("/static", express.static(__dirname + "/" + config.static_dir));
        
        app.get('/', function index (req, res) {
            var user = res.locals.user;
            if (user) {
                // check to see if user is an active member: is paying, has not had their account disabled, has appropriate membership information etc.
                if (!user.is_active()) {
                    res.locals.flash("warning", "Insufficient Membership.", "Unfortunately your account does not have rights to this page at the moment.");
                    res.redirect("/membership");
                }
                else {
                    res.render("webcam");
                }
            }
            else {
                res.locals.flash("danger", "Not logged in.", "You cannot access the webcam when not logged in.");
                res.redirect("/");
            }
        });
        
        return app;
    }
}

