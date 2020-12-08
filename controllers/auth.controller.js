const createError = require("http-errors");
const User = require("../model/Users");
const client = require("../helper/Init_redis");
const { required } = require("@hapi/joi");
const { authSchema } = require("../helper/validate");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helper/JWT_helper");

module.exports = {
  register: async (req, res, next) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const result = await authSchema.validateAsync(req.body);
      if (!email || !password) throw createError.BadRequest("bad request");
      const exist = await User.findOne({ email: result.email });
      if (exist)
        throw createError.Conflict(`${result.email} is already present`);

      const user = new User({ email: result.email, password: result.password });
      await user
        .save()
        .then(async (saveduser) => {
          const accessToken = await signAccessToken(saveduser.id);
          const refreshToken = await signRefreshToken(saveduser.id);
          res.send({ accessToken, refreshToken });
        })
        .catch((err) => {
          console.log(err.message);
          throw createError.Conflict("failed in saving user");
        });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      console.log(user);
      if (!user) throw createError.NotFound("user not registered");
      const isMatch = await user.isValidPassword(result.password);
      console.log(isMatch);
      if (!isMatch)
        throw createError.Unauthorized("Username/password incorrect");
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("invalid username/password"));
      next(error);
    }
  },
  frontendgoogleregister: async (req, res, next) => {
    try {
      const { googleId, email, name } = req.body.response.profileObj;
      User.findOne({ googleID: googleId }).then(async(currentuser) => {
        if (currentuser) {
          const accessToken = await signAccessToken(currentuser.id);
          const refreshToken = await signRefreshToken(currentuser.id);
          res.send({ accessToken, refreshToken });
        } else {
          new User({
            username: name,
            googleID: googleId,
            email: email,
            verified: true,
          })
            .save()
            .then(async(newuser) => {
              console.log("new user created" + newuser);
              const accessToken = await signAccessToken(newuser.id);
              const refreshToken = await signRefreshToken(newuser.id);
              res.send({ accessToken, refreshToken });
            });
        }
      });
    } catch (error) {
      console.log(error.message);
      next(createError(error));
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      let { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userid = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userid);
      refreshToken = await signRefreshToken(userid);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      console.log(error.message);
      next(createError(error));
    }
  },
  googleLogin: async (req, res, next) => {
    try {
      const { user } = req;
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      next(createError.InternalServerError());
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userid = await verifyRefreshToken(refreshToken);
      client.del(userid, (err, val) => {
        if (err) {
          console.log(err);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(err);
    }
  },
};
