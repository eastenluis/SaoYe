const keystone = require('keystone');
const async = require('async');
const TypesUtils = require('../../commons/types-utils.js');

exports = module.exports = function(req, res) {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    // Init locals
    locals.section = 'articles';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        posts: [],
        categories: [],
        isS3Enabled: TypesUtils.isS3Enabled()
    };

    // Load all categories
    view.on('init', function(next) {
        keystone.list('PostCategory').model.find().sort('name').exec((err, results) => {
            if (err || !results.length) {
                return next(err);
            }
            locals.data.categories = results;

            // Load the counts for each category
            async.each(locals.data.categories, function(category, next) {
                keystone.list('Post').model.count().where('categories').in([category.id]).exec((err, count) => {
                    category.postCount = count;
                    next(err);
                });
            }, (err) => next(err));
        });
    });

    // Load the current category filter
    view.on('init', function(next) {
        if (req.params.category) {
            keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
                locals.data.category = result;
                next(err);
            });
        } else {
            next();
        }
    });

    // Load the posts
    view.on('init', function(next) {
        const q = keystone.list('Post').model.find()
            .where('state', 'published')
            .limit(10)
            .sort('-publishedDate')
            .populate('uploader categories authors');

        if (locals.data.category) {
            q.where('categories').in([locals.data.category]);
        }

        q.exec(function(err, results) {
            locals.data.posts = results;
            next(err);
        });
    });

    // Render the view
    view.render('articles');
};
