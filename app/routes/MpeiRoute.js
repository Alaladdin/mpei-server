const express = require('express');
const {
  getActuality,
  setActuality,
  GetPlaylist,
  NotSupported,
} = require('../controllers/MpeiController');

const router = express.Router();

router.route('/api/getPlaylist/:playlistId').get(GetPlaylist);

router.route('/api/setActuality').post(setActuality);

router.route('/api/getActuality').get(getActuality);

router.route('/api/:method').get(NotSupported);

module.exports = router;
