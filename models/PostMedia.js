var keystone = require('keystone');
var TypesUtils = require('../commons/types-utils.js');

var PostMedia = new keystone.List('PostMedia', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
    defaultSort: '-uploadDate'
});

var mediaFieldSetting = TypesUtils.createMediaFileType('post/media/');

PostMedia.add({
    mediaFile: mediaFieldSetting,
    uploadDate: { type: Date, default: Date.now, readonly: true },
    url: {
        type: String, 
        readonly: true,
        watch: 'mediaFile', 
        value: function() {
            return this.mediaFile.url || ('post/media/' + this.mediaFile.filename);
        },
        description: {type: String}
    }
});

PostMedia.defaultColumns = 'url, uploadDate, description';
PostMedia.register();