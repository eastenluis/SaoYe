var keystone = require('keystone');
var Types = keystone.Field.Types;
var TypesUtils = require('../commons/types-utils.js');

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
    defaultSort: '-publishedDate'
});

// Use extra functions in commons/types-utils.js

var titleImageObj = TypesUtils.createImageFileType('post/images/');
titleImageObj.label = '标题文字（图片）';
var postImageObj = TypesUtils.createImageFileType('post/images/');
postImageObj.label = '封图';
var postThumbnailImageObj = TypesUtils.createImageFileType('post/images/');
postThumbnailImageObj.label = '缩略图';
var contentImages = TypesUtils.createLocalMultipleFileObj('post/images/');
contentImages.label = '内插图片';

Post.add({
    title: { type: String, label: '标题', required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    uploader: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, label: '发布日期', index: true, dependsOn: { state: 'published' } },
    titleImage: titleImageObj,
    postImage: postImageObj, 
    postThumbnailImage: postThumbnailImageObj,
    contentImages: contentImages,
    content: {
        brief: { type: Types.Html, label: '黄金一句', wysiwyg: true, height: 50 },
        intro: { type: Types.Html, label: '导语', wysiwyg: true, height: 150 },
        extended: { type: Types.Html, label: '正文', wysiwyg: true, height: 400 },
        editorNote: { type: Types.Html, label: '编辑手札', wysiwyg: true, height: 150 }
    },
    categories: { type: Types.Relationship, label: '分类', ref: 'PostCategory', many: true },
    authors: { type: Types.Relationship, label: '作者', ref: 'Author', many: true },
    promoteOrder: {type: Types.Number }
});

Post.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
