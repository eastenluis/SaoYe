var Types = require('keystone').Field.Types;
var TypesUtils = {};
var FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH || process.cwd();

TypesUtils.isS3Enabled = function() {
    return process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET;
};

TypesUtils.createS3FileObj = function(path, allowedTypes) {
    return {
        type: Types.S3File,
        s3path: '/files/' + path + '/',
        allowedTypes: allowedTypes,
        filename: function(item, filename, originalName) {
            return item._id + '-' + originalName;
        },
        format: function(item, file) {
            return file.url;
        }
    };
};

TypesUtils.createLocalFileType = function(path, allowedTypes) {
    return {
        type: Types.LocalFile,
        dest: FILE_STORAGE_PATH + '/files/' + path + '/',
        prefix: '/' + path + '/',
        allowedTypes: allowedTypes,
        filename: function(item, file) {
            return item.id + '-' + file.originalname;
        },
        format: function(item, file) {
            return file.filename;
        },
        note: '/files/' + path + '/file name'
    };
};

TypesUtils.createLocalMultipleFileObj = function(path) {
    return {
        type: Types.LocalFiles,
        dest: FILE_STORAGE_PATH + '/files/' + path + '/',
        prefix: '/' + path + '/',
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
        filename: function(item, file) {
            return item.id + '-' + file.originalname;
        },
        format: function(item, file) {
            return '<img src= "/files/' + path + file.filename + '" style="max-width: 750px">'
        },
        note: '/files/' + path + '/file name'
    };
};

TypesUtils.createImageFileType = function(path) {
    var allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    return TypesUtils.isS3Enabled() ?
        TypesUtils.createS3FileObj(path, allowedTypes) :
        TypesUtils.createLocalFileType(path, allowedTypes);
};

TypesUtils.createMediaFileType = function(path) {
    return TypesUtils.isS3Enabled() ? TypesUtils.createS3FileObj(path) : TypesUtils.createLocalFileType(path);
};

module.exports = exports = TypesUtils;
