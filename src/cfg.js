const path = require("path");
const cfgdef = require('aframework/cfgdef');
const commonCfgSet = require('./cfgset');
const cfg = cfgdef();
//----------------------------------------------------------------
cfg.loadContextFilePath = path.join(__dirname, 'loadcontext.js');
cfg.genFolder = path.join(__dirname, 'gen');
cfg.typeJsFolder = __dirname;
cfg.autowire.folders = [
    __dirname,
];
//----------------------------------------------------------------
cfg.web.view.viewFolder = require('./web/views/viewfolder');
cfg.mysql.database = 'commonbiz';
//----------------------------------------------------------------
commonCfgSet(cfg);
//----------------------------------------------------------------
module.exports = cfg;
