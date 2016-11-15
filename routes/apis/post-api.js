var keystone = require('keystone');

var get = function(req, res) {
    var query = req.query;
    var q = keystone.list('Post').model.find()
        .populate('categories authors').limit(query.limit || 10)
        .sort('-publishedDate').where('state', 'published');

    if (query.skip)
        q.skip(query.skip);
    if (query.category)
        q.where('categories').in([query.category]);
    if (query.author)
        q.where('authors').in([query.author]);

    q.exec().then(function(result) {
        var posts = result.map(function(post) {

        });
        res.send({ result: result });
    }, function(err) {
        res.status(500).send(err.message);
    });
};

exports.registerApis = function(app) {
    app.get('/api/post', get);
};
