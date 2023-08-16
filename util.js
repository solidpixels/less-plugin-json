const { isAbsolute, resolve, join } = require('path');

const getPath = function (filename, currentDirectory) {
  if (isAbsolute(filename)) {
    return filename;
  }
  return resolve(currentDirectory ? join(currentDirectory, filename) : filename);
}

module.exports = { getPath };