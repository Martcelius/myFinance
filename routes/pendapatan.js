const express = require('express');
const router = express.Router();

router.get('/bulanan', (req, res, next) => {
    res.render('pendapatan/bulanan', {
        layout: 'pendapatan/pendapatan'
    });
});

router.get('/harian', (req, res, next) => {
    res.render('pendapatan/harian', {
        layout: 'pendapatan/pendapatan'
    });
})


module.exports = router;