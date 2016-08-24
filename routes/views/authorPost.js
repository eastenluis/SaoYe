/**
 * Created by olvan on 2016-06-27.
 */
var keystone = require('keystone');
var TypesUtils = require('../../commons/types-utils.js');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'author';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		isS3Enabled: TypesUtils.isS3Enabled()
	};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Author').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('uploader');

		q.exec(function(err, result) {
			locals.data.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function(next) {

		var q = keystone.list('Author').model.find().where('state', 'published').sort('authorName').populate('uploader').limit('4');

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('authorPost');

};
