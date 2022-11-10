// Language: typescript

interface VidData {
    target: string;
    title: string;
    artist: string;
    description: string;
    thumbnail: {
        url: string;
        width: number;
        height: number;
    },
    url: string;
    duration: string;
}

interface ValidatedQuery {
    target: string;
    url: string;
    fetched?: any;
}

// validate a given query string and mark it with the appropriate target
// a string is valid if it is a valid url to a soundcloud, youtube, spotify or a phrase
// a phrase is valid if it is a string of characters that is not a url
function validateQuery(query): ValidatedQuery {

    var url = new URL("https://placeholder.com")

    try {
        url = new URL(query)
    }
    catch (e) {
        return { target: "phrase", url: query }
    }

    if (url.hostname === "soundcloud.com") {
        return { target: "soundcloud", url: query }
    } else if (url.hostname === "open.spotify.com") {
        return { target: "spotify", url: query }
    } else if (url.hostname === "www.youtube.com") {
        return { target: "youtube", url: query }
    } else if (url.hostname === "youtu.be") {
        return { target: "youtube", url: query }
    }
}

// after validating the query string, query the appropriate api and return the result
// if the query is a phrase, return the 10 best results from all three apis
function queryAPIs(query) {

    const validatedQuery = validateQuery(query)

    console.log(validatedQuery)

    if (validatedQuery.target === "soundcloud") {
        return querySoundcloud(validatedQuery)
    } else if (validatedQuery.target === "spotify") {
        return querySpotify(validatedQuery)
    } else if (validatedQuery.target === "youtube") {
        return queryYoutube(validatedQuery)
    } else if (validatedQuery.target === "phrase") {
        return queryPhrase(validatedQuery)
    }
}

// query phrase, fetching results from all three apis and returning the 10 best results
function queryPhrase(query: ValidatedQuery) {
    const youtubeResults = searchYoutube(query)
    // const soundcloudResults = await loadInterface(searchSoundcloud(query))
    // const spotifyResults = await loadInterface(searchSpotify(query))
    const results = youtubeResults // .concat(soundcloudResults, spotifyResults)
    return results
}

// fetch youtube snippet and content details and return the result
async function fetchYoutube(id) {
    const snippet = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)
    const contentDetails = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)

    const snippetJson = await snippet.json()
    const contentDetailsJson = await contentDetails.json()

    return {
        target: "youtube",
        id: snippetJson.items[0].id,
        snippet: snippetJson.items[0].snippet,
        contentDetails: contentDetailsJson.items[0].contentDetails
    }
}

// search youtube with a given query and return the first 10 results and no channels
async function searchYoutube(query: ValidatedQuery) {
    const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )
    const searched = await searchRes.json()

    //TODO load search results into interface
    for (let i = 0; i < searched.items.length; i++) {
        // fetch all data for each video with the fetchYoutube function
        const fetched = await fetchYoutube(searched.items[i].id.videoId)
        query.fetched = fetched
        query.target = "youtube"
        // load the fetched data into the interface
        searched.items[i] = loadInterface(query)

        // searched.items[i] = loadInterface(searched.items[i])
    }

    return searched.items
}

//search soundcloud with a given query and return the first 10 results
async function searchSoundcloud(query: ValidatedQuery) {
    const res = await fetch(
        "https://api.soundcloud.com/tracks?client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z&q=" + query //+ process.env.SOUNDCLOUD_API_KEY
    )
    const json = await res.json()
    return json
}

// search spotify with a given query and return the first 10 results
async function searchSpotify(query: ValidatedQuery) {
    const res = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=10",
        {
            headers: {
                Authorization: "Bearer " + process.env.SPOTIFY_ACCESS_TOKEN,
            },
        }
    )
    const json = await res.json()
    return json.tracks.items
}

// query youtube
async function queryYoutube(query: ValidatedQuery) {

    var videoId = query.url.split("v=")[1]

    const ampersandPosition = videoId.indexOf("&")
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition)
    }

    const snippet = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )

    const jsonSnippet = await snippet.json()

    const cDetails = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )
    const jsonCDetails = await cDetails.json()

    const json = {
        snippet: jsonSnippet.items[0].snippet,
        contentDetails: jsonCDetails.items[0].contentDetails
    }

    query.target = "youtube"
    query.fetched = json

    console.log(json)

    // TODO load video data into interface
    return [await loadInterface(query)]
}

// query soundcloud
async function querySoundcloud(query: ValidatedQuery) {
    const res = await fetch(
        `https://api.soundcloud.com/resolve?url=${query.url}&client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z${process.env.SOUNDCLOUD_API_KEY}`
    )
    const json = await res.json()

    query.target = "soundcloud"
    query.fetched = json

    return query
}

// query spotify
async function querySpotify(query: ValidatedQuery) {
    const res = await fetch(
        `https://api.spotify.com/v1/tracks/${query.url.split("/")[4]}`,
        {
            headers: {
                Authorization: "Bearer " + process.env.SPOTIFY_ACCESS_TOKEN,
            },
        }
    )
    const json = await res.json()

    query.target = "spotify"
    query.fetched = json

    return query
}

// create an interface for the three apis' return values with debug console logs
// pass the width and height of the thumbnail in a JSON with the thumbnail url
// recognise the api by the value of the target key
function loadInterface(query: ValidatedQuery): VidData {

    const data = query.fetched
    console.log(query.target)

    if (query.target === "youtube") {
        const ret_val: VidData = {
            target: "youtube",
            title: data.snippet.title,
            artist: data.snippet.channelTitle,
            description: data.snippet.description,
            thumbnail: {
                url: data.snippet.thumbnails.high.url,
                width: data.snippet.thumbnails.high.width, // / 2
                height: data.snippet.thumbnails.high.height, // / 2
            },
            url: "https://www.youtube.com/watch?v=" + data.id,
            // convert the duration from ISO 8601 to readable minutes and seconds
            duration: convertDuration(data.contentDetails.duration)[0],
        }
        return ret_val
    } else if (query.target === "soundcloud") {
        const ret_val: VidData = {
            target: "soundcloud",
            title: data.title,
            artist: data.user.username,
            description: data.description,
            thumbnail: {
                url: data.artwork_url,
                width: 0,
                height: 0,
            },
            url: data.permalink_url,
            duration: convertDuration(data.duration)[0],
        }
        return ret_val
    } else if (query.target === "spotify") {
        const ret_val: VidData = {
            target: "spotify",
            title: data.name,
            artist: data.artists[0].name,
            description: "",
            thumbnail: {
                url: data.album.images[0].url,
                width: data.album.images[0].width,
                height: data.album.images[0].height,
            },
            url: data.external_urls.spotify,
            duration: convertDuration(data.duration_ms)[0],
        }
        return ret_val
    } else {
        throw new Error("Invalid target")
    }
}


// convert ISO 8601 duration into hours:minutes:seconds
function convertDuration(duration) {

    // get the seperate values for hours, minutes and seconds
    // if they are not present, set them to undefined

    var hours: number
    try { hours = duration.match(/(\d+)H/)[1] } catch (e) { hours = 0 }
    var minutes: number
    try { minutes = duration.match(/(\d+)M/)[1] } catch (e) { minutes = 0 }
    var seconds: number
    try { seconds = duration.match(/(\d+)S/)[1] } catch (e) { seconds = 0 }



    return ([`${hours}h${minutes}m${seconds}s` /* , [hours, minutes, seconds] */])
}

// query the database at localhost:8000
async function searchDatabase(query) {
    const res = await fetch(
        "http://localhost:8000/search/" + query
    )
    const json = await res.json()
    return json
}

export {
    queryAPIs,
    searchDatabase,
    queryYoutube,
}

export type { VidData }