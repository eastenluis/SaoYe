var keystone = require('keystone');
var Types = keystone.Field.Types;
var TypesUtils = require('../commons/types-utils.js');

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true }
});

var galleryImageObj = TypesUtils.createFileTypeObj('gallery/images');
var heroImageObj = TypesUtils.createFileTypeObj('gallery/images');

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	heroImage: heroImageObj,
	images: galleryImageObj
});

Gallery.register();
