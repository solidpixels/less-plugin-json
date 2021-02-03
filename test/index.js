const FileManager = require('../FileManager.js');
const data = require('./variables.json');

const testVariables = () => {
  const manager = new FileManager();
  const result = manager.transformVariables(data);
  const reference = [
    '@margin:10px;',
    '@border--size:1px;',
    '@border--color:#fff999;',
    '@color-preset--215:#cdf;',
    '@array--0:#ccc;',
    '@array--1:null;',
    '@array--2:5;',
    '@array--3:true;',
    '@array--4:false;',
    '@use--lb:true;',
    '@use--flexbox:true;',
    '@use--header:true;'
  ];

  console.assert(JSON.stringify(result) === JSON.stringify(reference))
};

testVariables();
