var Types = require('keystone').Field.Types;
var TypesUtils = {};
var FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH || process.cwd();

TypesUtils.isS3Enabled = function() {
    return process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET;
};

TypesUtils.createS3FileObj = function(path) {
    return {
        type: Types.S3File,
        s3path: '/files/' + path + '/' ,
		allowedTypes: [
			'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'
		],
        filename: function(item, filename, originalName) {
            return item._id + '-' + originalName;
        },
		format: function(item, file){
			return '<pre>'+JSON.stringify(file, false, 2)+'</pre>'+
				'<img src="'+file.url+'" style="max-width: 300px">'
		}
    };
};

TypesUtils.createLocalFileObj = function(path) {
    return {
        type: Types.LocalFile,
        dest: FILE_STORAGE_PATH + '/files/' + path + '/',
        prefix: '/' + path + '/',
		allowedTypes: [
			'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'
		],
        filename: function(item, file) {
            return item.id + '-' + file.originalname;
        },
		format: function(item, file) {
			return '<img src= "/files/' + path + '/' + file.filename + '" style="max-width: 750px">'
		},
        note: '/files/' + path + '/file name'
    };
};

TypesUtils.createLocalMultipleFileObj = function(path) {
    return {
        type: Types.LocalFiles,
        dest: FILE_STORAGE_PATH + '/files/' + path + '/',
        prefix: '/' + path + '/',
		allowedTypes: [
			'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'
		],
        filename: function(item, file) {
            return item.id + '-' + file.originalname;
        },
		format: function(item, file) {
			return '<img src= "/files/' + path + file.filename + '" style="max-width: 750px">'
		},
        note: '/files/' + path + '/file name'
    };
};

TypesUtils.createFileTypeObj = function(path) {
    return TypesUtils.isS3Enabled() ? 
    TypesUtils.createS3FileObj(path) :
    TypesUtils.createLocalFileObj(path);  
};

module.exports = exports = TypesUtils;
