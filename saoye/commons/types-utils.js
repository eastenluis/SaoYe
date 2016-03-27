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
        dest: '/data/' + path,
        prefix: '/' + path + '/',
        filename: function(item, file) {
            return item.id + '.' + file.extension
        }
    };
};

TypesUtils.createFileTypeObj = function(path) {
    return TypesUtils.isS3Enabled() ? 
    TypesUtils.createS3FileObj(path) :
    TypesUtils.createLocalFileObj(path);  
};

module.exports = exports = TypesUtils;
