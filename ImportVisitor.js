const { getPath } = require('./util');

module.exports = function(less) {
  function ImportVisitor(filesCache) {
    this.separator = '--';
    this._visitor = new less.visitors.Visitor(this);
    this._filesCache = filesCache;
  };
  
  ImportVisitor.prototype = {
    isReplacing: true,
    isPreEvalVisitor: true,
  
    run: function (root) {
      const result = this._visitor.visit(root);
      return result;
    },
  
    visitDeclaration: function (node) {
      return node;
    },
  
    transform: function (variables) {
      const result = [];
  
      const transform = (innerObj, prefix = []) => {
        let finalValue = innerObj;
  
        if (innerObj === '') {
          throw new Error(`Empty variable ${prefix.join(this.separator)}`);
        } else if (prefix[0] && prefix[0].substr(0, 1) === '$') {
          if (innerObj instanceof Array) {
            finalValue = new less.tree.Value(innerObj.map((item) => new less.tree.Quoted('"', item)));
          } else {
            finalValue = new less.tree.DetachedRuleset(
              new less.tree.Ruleset(undefined, Object.entries(innerObj).map(([key, value]) => new less.tree.Declaration(key, value)))
            );
          }
  
          result.push(new less.tree.Declaration(`@${prefix[0].substr(1)}`, finalValue));
        } else if (innerObj && typeof innerObj === 'object') {
          for (let i = 0, keys = Object.keys(innerObj); i < keys.length; i++) {
            const key = keys[i];
            transform(innerObj[key], prefix.concat(key))
          }
        } else {
          if (typeof innerObj === 'boolean') {
            finalValue = new less.tree.Anonymous(!!finalValue);
          } else {
            finalValue = new less.tree.Anonymous(String(finalValue));
          }
  
          result.push(new less.tree.Declaration(`@${prefix.join(this.separator)}`, finalValue));
        }
      }
  
      transform(variables);
      return result;
    },
  
    visitImport: function (node) {
      const filename = node.path.value;
      const currentFileInfo = node.currentFileInfo;
      const currentDirectory = currentFileInfo.currentDirectory;
      const filePath = getPath(filename, currentDirectory);
      const filesContent = this._filesCache[filePath];
      return filesContent ? this.transform(filesContent) : node;
    },
  };
  
  return ImportVisitor;  
};