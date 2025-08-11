const path = require("path");
const cfgdef = require('aframework/cfgdef');
const userServiceSet = require('./cfgset');
const cfg = cfgdef();
//----------------------------------------------------------------
//----------------------------------------------------------------
const nodeModulesPath = path.join(__dirname, "..", 'node_modules');
cfg.nodeModulesPath = nodeModulesPath; // ejs 页面里面使用了这个路径
cfg.loadContextFilePath = path.join(__dirname, 'loadcontext.js');
cfg.genFolder = path.join(__dirname, 'gen');
cfg.typeJsFolder = __dirname;
cfg.autowire.folders = [
    __dirname,
];
//----------------------------------------------------------------
cfg.web.view.apiStubFolder = require('./web/views/viewfolder');
cfg.web.view.staticFolder = path.join(nodeModulesPath, "web_resources/src/web/public");
console.log(cfg.web.view.staticFolder)
cfg.mysql.database = 'user_service';
//----------------------------------------------------------------
userServiceSet(cfg);
//----------------------------------------------------------------
module.exports = cfg;
