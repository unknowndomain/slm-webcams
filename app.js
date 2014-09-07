var express = require( 'express' ),
	_ = require( 'underscore' ),
	request = require( 'request' );

module.exports = {
	'title': 'Webcams',
	'name': 'webcams',
	'app': function webcam ( config, db, site ) {
		var app = express();
		_.extend(app.locals, site.locals);
		
		app.set( 'views', __dirname + '/views' );
		
		site.use( '/static', express.static( __dirname + '/' + config.static_dir ) );
		
		site.get( '/webcams/*.jpg', function( req, res ) {
			var camera_id = req.params[0] - 1;
			if ( camera_id < config.webcams.length ) {
				var camera = config.webcams[ req.params[0] - 1 ];
			    req.pipe( request( camera.source ) ).pipe( res );
			} else {
				res.status( 404 ).send();
			}
		} );
		
		app.get( '/', function index ( req, res ) {
			var user = res.locals.user;
			if ( user ) {
				if ( ! user.is_active() ) {
					res.locals.flash( 'danger', 'Access Denied.', 'You do not have permission to access this area.' );
					res.redirect( '/membership' );
				} else {
					res.render( 'webcams', { cameras: config.webcams } );
				}
			} else {
				res.locals.flash( 'danger', 'Not logged in.', 'You are not logged in.' );
				res.redirect( '/' );
			}
		} );
		return app;
	}
}