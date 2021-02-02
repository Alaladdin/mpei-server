const express = require('express');
const { GetPlaylist, NotSupported } = require('../controllers/MpeiController');

const router = express.Router();

router.route('/api/getPlaylist/:playlistId').get(GetPlaylist);

router.route('/api/:method').get(NotSupported);

module.exports = router;
