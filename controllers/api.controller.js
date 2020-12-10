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
      console.log(aud);
      const {
        firstname,
        lastname,
        bio,
        mobile,
        image,
        pin,
        city,
        address,
      } = req.body;
      const update = {
        firstname,
        lastname,
        bio,
        mobile,
        image,
        pin,
        city,
        address,
      };
      User.findByIdAndUpdate(aud, update, { new: true }, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
          console.log(result);
        }
      });
    } catch (error) {
      next(createError(error));
    }
  },
};
