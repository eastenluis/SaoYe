const Types = require('keystone').Field.Types;
const Storage = require('keystone').Storage;
const TypesUtils = {};
const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH || process.cwd();

TypesUtils.isS3Enabled = function() {
    return process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET;
};

/**
 * @param {string} path
 * @return {Object}
 */
TypesUtils.createS3FileObj = function(path) {
    const storage = new Storage({
        adapter: require('keystone-storage-adapter-s3'),
        s3: {
            key: process.env.S3_KEY,
            secret: process.env.S3_SECRET,
            bucket: process.env.S3_BUCKET,
            path: 'files/' + path
        },
        schema: { path: true, url: true }
    });

    return { type: Types.File, storage };
};

/**
 * @param {string} path
 * @return {Object}
 */
TypesUtils.createLocalFileType = function(path) {
    const storage = new Storage({
        adapter: Storage.Adapters.FS,
        fs: {
            path: FILE_STORAGE_PATH + '/files/' + path + '/',
            publicPath: '/' + path
        },
        schema: { path: true, url: true }
    });

    return {
        type: Types.File,
        storage
    };
};

/**
 * @deprecated
 * @param {string} path
 * @reutrn {Object} 
 */
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
            return '<img src= "/files/' + path + file.filename + '" style="max-width: 750px">';
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
