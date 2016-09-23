(function() {
    'use strict';

    (function() {
        'use strict';

        var articleSkip = 2;
        var limit = 2;
        var postTmpl = $.templates('#postTmpl');

        $('#load-more').on('click', function() {
            $('#load-more').prop('disabled', true);
            var url = '/api/post?skip=' + articleSkip + '&limit=' + limit;
            $.ajax(url).done(function(data) {
                articleSkip += data.result.length;
                if (data.result.length > 0) {
                    var posts = data.result.map(function(post) {
                        var imageUrl = '/images/saoye_logo_black.svg';
                        if (post.postThumbnailImage)
                            imageUrl = post.postThumbnailImage.url || '/post/images/' + post.postThumbnailImage.filename;
                        var displayPost = {
                            imageUrl: imageUrl,
                            slug: post.slug,
                            title: post.title,
                            brief: post.content.brief,
                            date: post.publishedDate,
                            authors: post.authors,
                            categories: post.categories
                        };
                        return displayPost;
                    });
                    var newList = postTmpl.render(posts);
                    $('#post-list').append(newList);
                }

                if (data.result.length >= limit) {
                    $('#load-more').prop('disabled', false);
                } else {
                    $('#load-more').css('display', 'none');
                }
            }).fail(function(err) {
                console.error(err.message);
                $('#load-more').prop('disabled', false);
            });
        });
    })();
})();
