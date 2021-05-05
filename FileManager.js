// lessc style.less --plugin=index.js
const fs = require('fs');
const path = require('path');
const less = require('less');

const FileManager = function() {};

FileManager.prototype = new less.FileManager();

FileManager.prototype.stringify = function(obj) {
  if (!obj) {
    throw new Error('Undefined variable');
  }
  // LESS does not support recursive maps
  if (obj instanceof Array) {
    return obj.join(',');
  }
  return `{${Object.keys(obj).map((key) => `${key}:${obj[key]}`).join(';')}}`;
};

FileManager.prototype.transformVariables = function(obj) {
  const result = [];
  const transform = (innerObj, prefix = []) => {
    if (prefix[0] && prefix[0].substr(0, 1) === '$') {
      result.push(`@${prefix[0].substr(1)}:${this.stringify(innerObj)};`);
      return;
    }

    if (innerObj && typeof innerObj === 'object') {
      for (let i = 0, keys = Object.keys(innerObj); i < keys.length; i++) {
        const key = keys[i];
        transform(innerObj[key], prefix.concat(key))
      }
      return;
    }

    result.push(`@${prefix.join('--')}:${innerObj};`);
    return;
  }

  transform(obj);

  return result;
};

FileManager.prototype.getPath = function(filename, currentDirectory) {
  if (path.isAbsolute(filename)) {
    return filename;
  }
  return currentDirectory ? path.join(currentDirectory, filename) : filename;
}

FileManager.prototype.loadFile = function(filename, currentDirectory, options, environment) {
  // Check filename again, some environments (ie. Gulp) skip `supports` method.
  if (!filename.match(/\.json?$/)) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let contents;
    try {
      const fileContent = require(this.getPath(filename, currentDirectory));
      contents = this.transformVariables(fileContent).join('');
    } catch (err) {
      reject(err);
    }

    if (contents) {
      resolve({ contents, filename });
    } else {
      reject(new Error('Can\'t generate JSON variables file.'))
    }
  });
};

FileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
  if (!filename.match(/\.json?$/)) {
    return false;
  }

  try {
    const stat = fs.statSync(this.getPath(filename, currentDirectory));
    return stat.isFile();
  } catch (err) {
    console.log(err);
  }

  return false;
};

FileManager.prototype.tryAppendExtension = function(filename, ext) {
  return filename;
};

module.exports = FileManager;
