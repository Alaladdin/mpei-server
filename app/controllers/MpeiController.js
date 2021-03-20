const YouTube = require('simple-youtube-api');
const { CacheService } = require('../cache/CacheService');
const Discord = require('../models/Discord');
const replace = require('../utility/replace');

const youtube = new YouTube(process.env.YOUTUBE_API);
const ttl = 3600; // 1 hour
const cache = new CacheService(ttl);

const GetPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { maxResults } = req.query;
  const playlistCacheKey = `getPlaylist__${playlistId}`;
  const videosCacheKey = `getVideos__${maxResults}__${playlistId}`;

  return cache.get(playlistCacheKey, () => youtube.getPlaylistByID(playlistId))
    .then((playlist) => cache.get(videosCacheKey, () => playlist.getVideos(maxResults)))
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

// NotSupported
const NotSupported = async (req, res) => res.status(400)
  .json({ message: 'method is not supported' });

// getActuality
const getActuality = async (req, res) => {
  try {
    return cache.get('actuality', async () => Discord.findOne({ actuality: Object })
      .select({
        actuality: 1,
      })
      .lean())
      .then((data) => {
        if (data) return res.status(200).json({ actuality: data.actuality });
        return res.status(404).json({ error: 'Actuality not found in database' });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

// setActuality
const setActuality = async (req, res) => {
  const { actuality } = req.body || {};

  const existsActuality = await Discord.findOne({ actuality: Object });
  if (!existsActuality) {
    const newAct = new Discord({ actuality: { content: replace.all(actuality) } });
    await newAct.save();
    return res.status(201).json({ newAct });
  }

  try {
    const result = await Discord.findOneAndUpdate(
      { actuality: Object },
      {
        actuality: {
          content: replace.all(actuality),
          date: Date.now(),
        },
      }, {
        new: true,
        upsert: true,
      },
    );

    return res.status(200).json({ actuality: result.actuality });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

module.exports = {
  getActuality,
  setActuality,
  GetPlaylist,
  NotSupported,
};
