const Employee = require("./employee");

const employee = new Employee();

module.exports = async (req, res) => {
  res.json(await employee.get());
};
