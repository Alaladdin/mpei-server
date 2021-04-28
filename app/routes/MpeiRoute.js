const express = require('express');
const {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  getPlaylist,
  notSupported,
  getHealth,
  getVersion,
  ping,
} = require('../controllers/MpeiController');

const router = express.Router();

router.route('/api/addStudentsGroup/').post(addStudentsGroup);
router.route('/api/getStudentsGroups/').get(getStudentsGroups);
router.route('/api/getSchedule/').get(getSchedule);
router.route('/api/getPlaylist/:playlistId').get(getPlaylist);
router.route('/api/setActuality').post(setActuality);
router.route('/api/getActuality').get(getActuality);
router.route('/api/ping').get(ping);
router.route('/api/health').get(getHealth);
router.route('/api/version').get(getVersion);
router.route('/api/:method').get(notSupported);

module.exports = router;
