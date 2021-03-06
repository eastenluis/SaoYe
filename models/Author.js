/**
 * Created by olvan on 2016-06-26.
 */
var keystone = require('keystone')
var Types = keystone.Field.Types;
var TypesUtils = require('../commons/types-utils.js');

/**
 * Author Model
 * ==================
 */

var Author = new keystone.List('Author', {
	map: { name: 'authorName' },
	autokey: { path: 'slug', from: 'authorName', unique: true },
	sortable: true
});

// Use extra functions in commons/types-utils.js
var authorImageObj = TypesUtils.createImageFileType('author/images/');

Author.add({
	authorName: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	uploader: { type: Types.Relationship, ref: 'User', index: true },
	authorImage: authorImageObj,
	isListedAuthor: { type: Types.Boolean, default: false, initial: true, index: true },
	introduction: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 }
	}
});

Author.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});


Author.relationship({ path: 'posts', ref: 'Post', refPath: 'authors' });

Author.defaultColumns = 'authorName, isListedAuthor, state';
Author.register();
