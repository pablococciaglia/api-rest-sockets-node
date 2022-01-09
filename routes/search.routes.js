const { Router } = require('express');
const { search } = require('../Controllers/search.controller');

const router = Router();
router.get('/:collection/:query', search);
module.exports = router;
