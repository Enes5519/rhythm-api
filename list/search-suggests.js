const fetch = require("node-fetch")
const baseURL = "http://www.google.com/complete/search?client=firefox&ds=yt&hl=tr&ie=utf_8&oe=utf_8&format=legacy&q="

const searchSuggest = async (keyword) => {
    const response = await fetch(baseURL + encodeURIComponent(keyword), {headers: {"content-type": "application/json; charset=utf-8"}})
    return response.json()
}

module.exports = searchSuggest