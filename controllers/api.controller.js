const createError = require("http-errors");
const User = require("../model/Users");
module.exports = {
  getuser: async (req, res, next) => {
    try {
      const { aud } = req.payload;
      User.findById(aud, (err, result) => {
        if (err) throw err;
        else {
          console.log(result);
          res.send(result);
        }
      });
    } catch (error) {
      next(createError(error));
    }
  },
  postUserUpdate: async (req, res, next) => {
    try {
      const { aud } = req.payload;
      User.findById(aud, (err, result) => {
        if (err) throw err;
        else {
          console.log(result);
          res.send(result);
        }
      });
    } catch (error) {
      next(createError(error));
    }
  },
};
