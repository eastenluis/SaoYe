var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'about';
	locals.data = {
		posts: [],
	};

	
	// Render the view
	view.render('about');

};