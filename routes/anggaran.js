const express = require('express');
const router = express.Router();

router.get('/bulanan', (req, res, next) => {
    res.render('anggaran/bulanan', {
        layout: 'pendapatan/pendapatan'
    });
})

router.get('/harian', (req, res, next) => {
    res.render('anggaran/harian', {
        layout: 'pendapatan/pendapatan'
    });
})



module.exports = router;