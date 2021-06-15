const fetch = require('node-fetch');
const YouTube = require('simple-youtube-api');
const pJson = require('../../package.json');
const Actuality = require('../models/Actuality');
const StudentsGroups = require('../models/StudentsGroups');
const replace = require('../utility/replace');
const filterArray = require('../utility/filterArray');
const { clearCache } = require('../setup/cache');
const {
  authToken: serverAuthToken, youtubeApi, cacheTime, getMpeiScheduleUrl,
} = require('../../config');

const youtube = new YouTube(youtubeApi);

const getPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { maxResults } = req.query;

  if (!playlistId) return res.status(400).json({ message: 'playlistId was not provided' });

  // const playlistCacheKey = `getPlaylist__${playlistId}`;
  // const videosCacheKey = `getVideos__${maxResults}__${playlistId}`;

  return youtube.getPlaylistByID(playlistId)
    .then((playlist) => playlist.getVideos(maxResults))
    .then((videos) => {
      const data = {};
      videos.forEach((video) => {
        const { snippet } = video.raw;
        data[snippet.resourceId.videoId] = snippet.title;
      });
      return res.status(200).json({
        videos: {
          count: videos.length,
          data,
        },
      });
    })
    .catch((err) => res.status(400).json({ message: err }));
};

// getActuality
const getActuality = async (req, res) => {
  try {
    return Actuality.findOne({ actuality: Object })
      .select({ actuality: 1 })
      .lean()
      .cache(cacheTime, 'actuality')
      .then((data) => {
        if (data) return res.status(200).json({ actuality: data.actuality });
        return res.status(404).json({ message: 'Actuality not found in database' });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

// setActuality
const setActuality = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { content, lazyContent } = req.body.actuality || {};
  const existsActuality = await Actuality.findOne({ actuality: Object });
  const { actuality: currAct } = existsActuality || {};

  await clearCache('actuality');

  if (!existsActuality) {
    const newAct = new Actuality({
      actuality: {
        content: content ? replace.all(content) : null,
        lazyContent: lazyContent ? replace.all(lazyContent) : null,
      },
    });

    await newAct.save();

    return res.status(201).json({ newAct });
  }

  try {
    await existsActuality.updateOne(
      {
        actuality: {
          content: content ? replace.all(content) : currAct.content,
          lazyContent: lazyContent ? replace.all(lazyContent) : currAct.lazyContent,
        },
      },
    );

    return res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

// getSchedule
const getSchedule = async (req, res) => {
  const { start, finish, group } = req.query;
  const url = getMpeiScheduleUrl(start, finish, group);

  return fetch(url)
    .then(async (r) => {
      // if request error
      if (!r.ok) throw new Error(r.statusText);

      let schedule = await r.json() || [];
      const scheduleIndexesToDelete = [];

      // compare two nearest array elements
      for (let i = 0; i <= schedule.length - 2; i += 2) {
        const c = schedule[i]; // current elements
        const n = schedule[i + 1]; // next element

        if (!n) break; // stop loop, if next element not exists

        if (
          (c.date === n.date)
          && (c.discipline === n.discipline)
          && (c.kindOfWork === n.kindOfWork)
          && (c.lecturer === n.lecturer)
        ) {
          // combine two array elements
          schedule[i].endLesson = n.endLesson;
          scheduleIndexesToDelete.push(i + 1);
        }
      }

      // filter array
      schedule = filterArray(schedule, scheduleIndexesToDelete);

      return res.status(200).json({ schedule });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'some error was occurred' });
    });
};

// getStudentsGroups
const getStudentsGroups = async (req, res) => {
  try {
    return StudentsGroups.find()
      .select({
        id: 1,
        title: 1,
      })
      .lean()
      .cache(cacheTime, 'studentsGroups')
      .then((data) => {
        if (data) return res.status(200).json({ studentsGroups: data });
        return res.status(404).json({ message: 'students group not found in database' });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

// addStudentsGroup
const addStudentsGroup = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { studentsGroup } = req.body || {};
  const isGroupExists = !!await StudentsGroups.findOne({ id: studentsGroup.id });

  if (isGroupExists) return res.status(400).json({ message: 'students group with this id already exists' });

  try {
    const newGroup = new StudentsGroups({
      id: studentsGroup.id,
      title: studentsGroup.title,
    });

    await newGroup.save();
    await clearCache('studentsGroups');

    return res.status(201).json({ newGroup });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

// getHealth
const getHealth = async (req, res) => res.status(200).json({ message: 'ok' });

// getVersion
const getVersion = async (req, res) => res.status(200).json({ version: pJson.version });

// ping
const ping = async (req, res) => res.status(200).json({ message: 'pong' });

// notFounded
const notFounded = async (req, res) => res.status(404).json({ message: 'method not found' });

module.exports = {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  getPlaylist,
  notFounded,
  getHealth,
  getVersion,
  ping,
};
