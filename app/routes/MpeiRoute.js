const express = require('express');
const {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  GetPlaylist,
  NotSupported,
} = require('../controllers/MpeiController');

const router = express.Router();

router.route('/api/addStudentsGroup/').post(addStudentsGroup);

router.route('/api/getStudentsGroups/').get(getStudentsGroups);

router.route('/api/getSchedule/').get(getSchedule);

router.route('/api/getPlaylist/:playlistId').get(GetPlaylist);

router.route('/api/setActuality').post(setActuality);

router.route('/api/getActuality').get(getActuality);

router.route('/api/:method').get(NotSupported);

module.exports = router;
