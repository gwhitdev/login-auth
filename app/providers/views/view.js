
const path = require('path');
const view =  {
    parentDir: '',
    html: function(file) {
        return path.join(`${this.parentDir}/src/views/${file}.html`);
    }
};

module.exports = view;