const path = require("path");
const cfgdef = require('aframework/cfgdef');
const userServiceSet = require('./cfgset');
const cfg = cfgdef();
cfg.app.rootFolder = path.join(__dirname, '..');
cfg.autowire.folders = [
    __dirname,
];
//----------------------------------------------------------------
cfg.mysql.database = 'user_service';
//----------------------------------------------------------------
userServiceSet(cfg);
//----------------------------------------------------------------
module.exports = cfg;
