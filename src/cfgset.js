const userServiceSet = (cfg) => {
    cfg.web.view.staticFolder = require('./web/views/viewfolder');
}


module.exports = userServiceSet;
