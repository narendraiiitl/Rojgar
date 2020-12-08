const jwt = require("jsonwebtoken");
const client = require("../helper/Init_redis");
const createError = require("http-errors");
require("dotenv").config();
module.exports = {
  signAccessToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: "1h",
        issuer: "Rojgar",
        audience: userid,
      };
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"].split(" ");
    const token = authHeader[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError")
          return next(createError.Unauthorized());
        return next(createError.Unauthorized(err.message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const option = {
        expiresIn: "1y",
        issuer: "Rojgar",
        audience: userid,
      };
      jwt.sign(payload, secret, option, async (err, token) => {
        if (err) {
          console.log(err.message);

          return reject(createError.InternalServerError());
        }
        client.set(userid, token, "EX", 60 * 60 * 24 * 30, (err, reply) => {
          if (err) {
            console.log(err);
            reject(createError.InternalServerError());
            return;
          }
        });
        resolve(token);
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userid = payload.aud;
          client.get(userid, (err, result) => {
            if (err) {
              console.log(err);
              reject(createError.InternalServerError());
              return;
            }
            if (refreshToken === result) {
              return resolve(userid);
            }
            reject(createError.Unauthorized());
          });
          resolve(userid);
        }
      );
    });
  },
};
