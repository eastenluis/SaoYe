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
		author: [],
		authorPosts: [],
		isS3Enabled: TypesUtils.isS3Enabled()
	};
	

	// Load information for the current user
	view.on('init', function(next) {

		var q = keystone.list('Author').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('uploader');

		q.exec(function(err, result) {
			locals.data.author = result;
			next(err);
		});

	});

	// Load posts that are composed by this author
	view.on('init', function(next) {

		var q = keystone.list('Post').model.find()
			.where('state', 'published')
			.where('authors').in([locals.data.author])
			.populate('categories')
			.limit(10);
		
		q.exec(function(err, results) {
			locals.data.authorPosts = results;
			next(err);
		});
	});

	// Render the view
	view.render('authorPost');

};
