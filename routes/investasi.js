const express = require('express');
const router = express.Router();

router.get('/tetap', (req, res, next) => {
    res.render('investasi/tetap', {
        layout: 'pendapatan/pendapatan'
    });
});


module.exports = router;