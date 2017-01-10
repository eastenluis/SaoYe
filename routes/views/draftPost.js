var keystone = require('keystone');
var TypesUtils = require('../../commons/types-utils.js');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'articles';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		isS3Enabled: TypesUtils.isS3Enabled()
	};

	// Load the current post
	view.on('init', function(next) {

		Post.model
			.findOne({
				state: 'draft',
				slug: locals.filters.post
			})
			.populate('uploader categories authors').exec()
			.then(function(result) {
				locals.data.post = result;
				if (result.authors && result.authors.length > 0) {
					return Post.model.find()
						.where('state', 'draft')
						.where('authors', result.authors[0].id)
						.where('_id').ne(locals.data.post.id)
						.sort('-publishedDate')
						.limit(4).exec();
				}
				return Promise.resolve([]);
			}, function(err) {
				throw err;
			}).then(function(results) {
				locals.data.authorPosts = results;
				next();
			}, function(err) {
				next(err);
			});

	});

	// Render the view
	view.render('post');

};