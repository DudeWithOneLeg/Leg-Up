const express = require('express');
const router = express.Router();
const { environment } = require('../config');
const isProduction = environment === 'production';

router.get('/hello/world', function(req, res) {
    console.log(req.csrfToken())
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
});

module.exports = router
