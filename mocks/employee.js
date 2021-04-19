const NodeCache = require( "node-cache" );
const fetch = require("node-fetch");
const myCache = new NodeCache();

function Employee() {}

Employee.prototype.get = async function() {

  return new Promise((resolve, reject) => {
    if (data = myCache.get('employeeData')) {
      resolve(data);
      return;
    }

    fetch("https://gist.githubusercontent.com/yousifalraheem/354fb07f27f3c145b78d7a5cc1f0da0b/raw")
    .then(res => res.json())
    .then(json => {
      myCache.set('employeeData', json);
      resolve(json);
    })
    .catch(err => reject(err));
  });
}

module.exports = Employee;
