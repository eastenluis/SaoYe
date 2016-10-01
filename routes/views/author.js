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
		authorCols: [],
		categories: [],
		isS3Enabled: TypesUtils.isS3Enabled()
	};

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

		var q = keystone.list('Author').model.find()
			.where('state', 'published')
			.sort('order')
			.populate('uploader');

		q.exec(function(err, results) {
			locals.data.authors = results;
			locals.data.authorCols = [[], [], []];
			results.forEach(function(author, index) {
				var col = index % 3;
				locals.data.authorCols[col].push(author);
			});
			next(err);
		});

	});

	// Render the view
	view.render('author');

};

