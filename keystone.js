// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var params = {
	'name': 'Saoye',
	'brand': 'Saoye',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	'emails': 'templates/emails',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'signin logo': '/images/saoye_logo_white.png'
};
if (process.env.MONGOLAB_URI)
    params.mongo = process.env.MONGOLAB_URI;

keystone.init(params);

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'authors': 'authors',
	'users': 'users'
});

// Add a new resource to the root file
keystone.set('static', ['public', 'files']);

// Set S3 configuration.
if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
	keystone.set('s3 config', {
		bucket: process.env.S3_BUCKET,
		key: process.env.S3_KEY,
		secret: process.env.S3_SECRET,
		'default headers': {
			'x-amz-meta-X-Default-Header': 'Custom Default Value'
		}
	});
}

// Start Keystone to connect to your database and initialise the web server

keystone.start();
