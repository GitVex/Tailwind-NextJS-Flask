// Language: typescript

// validate a given query string and mark it with the appropriate target
// a string is valid if it is a valid url to a soundcloud, youtube, spotify or a phrase
// a phrase is valid if it is a string of characters that is not a url
function validateQuery(query) {

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
export async function queryAPIs(query) {
    const validatedQuery = validateQuery(query)
    if (validatedQuery.target === "soundcloud") {
        return await querySoundcloud(validatedQuery.url)
    } else if (validatedQuery.target === "spotify") {
        return await querySpotify(validatedQuery.url)
    } else if (validatedQuery.target === "youtube") {
        return await queryYoutube(validatedQuery.url)
    } else if (validatedQuery.target === "phrase") {
        return await queryPhrase(validatedQuery.url)
    }
}

// query phrase, fetching results from all three apis and returning the 10 best results
async function queryPhrase(query) {
    const youtubeResults = await searchYoutube(query)
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
async function searchYoutube(query) {
    const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )
    const searched = await searchRes.json()

    console.log(searched)

    //TODO load search results into interface
    for (let i = 0; i < searched.items.length; i++) {
        // fetch all data for each video with the fetchYoutube function
        const fetched = await fetchYoutube(searched.items[i].id.videoId)
        console.log(fetched)
        // load the fetched data into the interface
        searched.items[i] = loadInterface(fetched)

        // searched.items[i] = loadInterface(searched.items[i])
    }

    return searched.items
}

//search soundcloud with a given query and return the first 10 results
async function searchSoundcloud(query) {
    const res = await fetch(
        "https://api.soundcloud.com/tracks?client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z&q=" + query //+ process.env.SOUNDCLOUD_API_KEY
    )
    const json = await res.json()
    return json
}

// search spotify with a given query and return the first 10 results
async function searchSpotify(query) {
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
async function queryYoutube(url) {

    var videoId = url.split("v=")[1]
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

    console.log(json)

    // TODO load video data into interface
    return [await loadInterface(json)]
}

// query soundcloud
async function querySoundcloud(url) {
    const res = await fetch(
        "https://api.soundcloud.com/resolve?url=" +
        url +
        "&client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z" //+ process.env.SOUNDCLOUD_API_KEY
    )
    const json = await res.json()
    return json
}

// query spotify
async function querySpotify(url) {
    const res = await fetch(
        "https://api.spotify.com/v1/tracks/" + url.split("/")[4],
        {
            headers: {
                Authorization: "Bearer " + process.env.SPOTIFY_ACCESS_TOKEN,
            },
        }
    )
    const json = await res.json()
    return json
}

// create an interface for the three apis' return values with debug console logs
// pass the width and height of the thumbnail in a JSON with the thumbnail url
// recognise the api by the value of the target key
function loadInterface(data) {

    if (data.target === "youtube") {
        return {
            target: "youtube",
            title: data.snippet.title,
            artist: data.snippet.channelTitle,
            description: data.snippet.description,
            thumbnail: {
                url: data.snippet.thumbnails.high.url,
                width: data.snippet.thumbnails.high.width / 2,
                height: data.snippet.thumbnails.high.height / 2,
            },
            url: "https://www.youtube.com/watch?v=" + data.id,
            // convert the duration from ISO 8601 to readable minutes and seconds
            duration: convertDuration(data.contentDetails.duration),
        }
    } else if (data.target === "soundcloud") {
        return {
            target: "soundcloud",
            title: data.title,
            artist: data.user.username,
            description: data.description,
            thumbnail: {
                url: data.artwork_url,
                width: 50,
                height: 50,
            },
            url: data.permalink_url,
        }
    } else if (data.target === "spotify") {
        return {
            target: "spotify",
            title: data.name,
            artist: data.artists[0].name,
            description: data.album.name,
            thumbnail: {
                url: data.album.images[0].url,
                width: data.album.images[0].width / 2,
                height: data.album.images[0].height / 2,
            },
            url: data.external_urls.spotify,
        }
    } else {
        return {
            target: "youtube",
            title: data.snippet.title,
            artist: data.snippet.channelTitle,
            description: data.snippet.description,
            thumbnail: {
                url: data.snippet.thumbnails.high.url,
                width: data.snippet.thumbnails.high.width / 2,
                height: data.snippet.thumbnails.high.height / 2,
            },
            url: "https://www.youtube.com/watch?v=" + data.id.videoId,
        }
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

    

    return ([`${hours}h${minutes}m${seconds}s`, [hours, minutes, seconds]])
}

// query the database at localhost:8000
async function searchDatabase(query) {
    const res = await fetch(
        "http://localhost:8000/search/" + query
    )
    const json = await res.json()
    return json
}