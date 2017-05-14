/* global $ */
(function() {
    'use strict';

    var articleSkip = 10;
    var limit = 10;
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
                        date: post.publishedDate ? $.format.date(post.publishedDate, 'yyyy.MM.dd') : null,
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
        }).fail(function() {
            $('#load-more').prop('disabled', false);
        });
    });
})();
