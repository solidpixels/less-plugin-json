const less = require('less');
const getImportVisitor = require('../ImportVisitor.js');
const data = require('./variables.json');

const testVariables = () => {
  const ImportVisitor = getImportVisitor(less);
  const visitor = new ImportVisitor();
  const result = visitor.transform(data);
  const reference = [
    '@margin',
    '@border--size',
    '@border--color',
    '@color-preset',
    '@empty',
    '@array--0',
    '@array--1',
    '@array--2',
    '@array--3',
    '@array--4',
    '@features'
  ];

  console.assert(JSON.stringify(result.map((node) => node.name)) === JSON.stringify(reference))
};

testVariables();
