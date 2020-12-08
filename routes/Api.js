
const apicontroller=require('../controllers/api.controller')
const router = require("express").Router();
const {verifyAccessToken} = require('../helper/JWT_helper');

router.get('/user', verifyAccessToken, apicontroller.getuser);
router.post('/user/update', verifyAccessToken, apicontroller.postUserUpdate);

module.exports = router;

