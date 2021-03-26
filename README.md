# MPEI server

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2517bf00c0ba4f7f9b848464b44f9d42)](https://app.codacy.com/gh/Alaladdin/mpei-server?utm_source=github.com&utm_medium=referral&utm_content=Alaladdin/mpei-server&utm_campaign=Badge_Grade_Settings)

This application is used as the site server [mpei.space](https://mpei.space) but you may find it useful for your project

## Usage

Create `.env` file on the folder root and write the following

``` dotenv
YOUTUBE_API=KEY_GOES_HERE   // Enter YOUTUBE API KEY
```

### API Methods

Api method example

``` http request
https://example.io/api/:method
```

| Name           | Params                       | Description                                                 | Returns
| :------------  | :--------------------------- | ----------------------------------------------------------- |----------------------------------------------- |
| `getPlaylist`  | `playlistId [, maxResults]`  | `playlistId` - youtube playlist id (required))              | `videos.count`, and `data[videoId]=videoTitle` |
|                |                              | `maxResults` - max videos count (default: all)              |
| `getSchedule`  | `[start, finish, group   ]`  | `start` - start date (dd.mm.YYYY)                           | `schedule` object                              |
|                |                              | `finish` - finish date (dd.mm.YYYY)                         |
|                |                              | `group` - group id                                          |
| `getActuality` | none                         | gets actuality object                                       | `actuality` object                             |
| `setActuality` | `playlistId [, maxResults]`  | sets actuality object                                       | new `actuality` object                         |

#### Request example

```javascript
fetch('https://example.io/api/getPlaylist/PLOU2XLYxmsILVTiOlMJdo7RQS55jYhsMi?maxResults=5');
```

#### Response example

```json
{
  "videos": {
    "count": 5,
    "data": {
      "lyRPyRKHO8M": "Google Keynote (Google I/O'19)",
      "VwVg9jCtqaU": "Machine Learning Zero to Hero (Google I/O'19)",
      "d_m5csmrf7I": "Pragmatic State Management in Flutter (Google I/O'19)",
      "zsnc0vkwWRk": "Michio Kaku on The Future of Humanity (Google I/O'19)",
      "c0oy0vQKEZE": "What’s new in JavaScript (Google I/O ’19)"
    }
  }
}
```

## Caching

For requests cache app uses [nodeCache](https://www.npmjs.com/package/node-cache) and custom cache class

### Usage

Cache uses **playlistId** as `playlistCacheKey` and **videos__{maxResults}__{playlistId}**
as `videosCacheKey`

``` javascript
const { CacheService } = require('../cache/CacheService');
const ttl = 3600; // 1 hour
const cache = new CacheService(ttl);

function getFeedById(feedID) {
  const selectQuery = `SELECT * FROM feeds WHERE feedID = ${feedID}`;

  return cache.get(feedID, () => DB.then((connection) =>
    connection.query(selectQuery)
    .then((rows) => rows[0])
  ))
  .then((result) => {
    return result;
  });
}
```
