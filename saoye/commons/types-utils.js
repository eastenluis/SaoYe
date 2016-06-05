var Types = require('keystone').Field.Types;
var TypesUtils = {};
TypesUtils.isS3Enabled = function() {
    return process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET;
};

TypesUtils.createS3FileObj = function(path) {
    return {
        type: Types.S3File,
        s3path: path,
        filename: function(item, filename) {
            return item._id + '-' + filename;
        }
    };
};

TypesUtils.createLocalFileObj = function(path) {
    return {
        type: Types.LocalFile,
        dest: process.cwd() + '/files/' + path,
        prefix: '/' + path,
		allowedTypes: [
			'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'
		],
        filename: function(item, file) {
            return item.id + '.' + file.extension
        },
		format: function(item, file) {
			return '<img src= "/files/' + path + file.filename + '" style="max-width: 750px">'
		}
    };
};

TypesUtils.createFileTypeObj = function(path) {
    return TypesUtils.isS3Enabled() ? 
    TypesUtils.createS3FileObj(path) :
    TypesUtils.createLocalFileObj(path);  
};

module.exports = exports = TypesUtils;
