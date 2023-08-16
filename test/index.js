const less = require('less');
const getFileManager = require('../FileManager.js');
const data = require('./variables.json');

const testVariables = () => {
  const FileManager = getFileManager(less)
  const manager = new FileManager();
  const result = manager.transformVariables(data);
  const reference = [
    '@margin:10px;',
    '@border--size:1px;',
    '@border--color:#fff999;',
    '@color-preset:{red:#ff0000;green:#ff0000};',
    '@empty:{};',
    '@array--0:#ccc;',
    '@array--1:null;',
    '@array--2:5;',
    '@array--3:true;',
    '@array--4:false;',
    '@features:flexbox,header;'
  ];

  console.assert(JSON.stringify(result) === JSON.stringify(reference))
};

testVariables();
