loadContext = async function () {
    const a = require('aframework');
    const path = require("path");
    require('aframework/env').init(path.join(__dirname, 'dev.env'));
    const cfg = require('./cfg');
    await a.loadContext(cfg);
    return a;
}
module.exports = loadContext;

