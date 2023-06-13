const TAG_BEGIN = '['
const TAG_END = ']'

const TITLE_TAG_NAME = 'ti'
const ARTIST_TAG_NAME = 'ar'
const ALBUM_TAG_NAME = 'al'
const BY_TAG_NAME = 'by'
const OFFSET_TAG_NAME = 'offset'
//const META_TAG_DELIM = ":";

const TIME_REGEX = /\d{2}:\d{2}(:\d{2})?(\.\d{2,3})?/
const TIME_LINE_REGEX = /^\[\d{2}:\d{2}(:\d{2})?(\.\d{2,3})?].*/

export class Lyric {
    constructor(title, artist, album, by, offset) {
        this.title = title
        this.artist = artist
        this.album = album
        this.by = by
        this.offset = offset
        this.data = new Map()
    }
    hasData() {
        return Lyric.hasData(this)
    }

    static hasData(lyric) {
        return lyric && lyric.data.size > 0
    }
}
