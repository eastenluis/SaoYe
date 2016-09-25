var keystone = require('keystone');
var async = require('async');
var TypesUtils = require('../../commons/types-utils.js');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'author';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		authors: [],
		categories: [],
		isS3Enabled: TypesUtils.isS3Enabled()
	};

	// Load all categories
	// view.on('init', function(next) {

	// 	keystone.list('Author').model.find().sort('order').exec(function(err, results) {

	// 		if (err || !results.length) {
	// 			return next(err);
	// 		}

	// 		locals.data.categories = results;

	// 		// Load the counts for each category
	// 		async.each(locals.data.categories, function(category, next) {

	// 			keystone.list('Post').model.count().where('authors').in([category.id]).exec(function(err, count) {
	// 				category.authorCount = count;
	// 				next(err);
	// 			});

	// 		}, function(err) {
	// 			next(err);
	// 		});

	// 	});

	// });

	// Load the current category filter
	view.on('init', function(next) {

		if (req.params.category) {
			keystone.list('Author').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}

	});

	// Load the authors
	view.on('init', function(next) {

		var q = keystone.list('Author').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				'state': 'published'
				}
			})
			.sort('order')
			.populate('uploader');

		// if (locals.data.category) {
		// 	q.where('categories').in([locals.data.category]);
		// }

		q.exec(function(err, results) {
			locals.data.authors = results;
			next(err);
		});

	});

	// Render the view
	view.render('author');

};
 
