# rhythm-api
rhythm-api is a youtube extractor api server. rhythm-api uses [youtube-extractor](https://github.com/Enes5519/youtube-extractor).

## APIs
### /suggest
Get search suggestions.
#### Request
| Query   | Required |
|---|---|
| keyword | Yes |
#### Response
| Field   | Data Type |
|---|---|
| status | Int |
| suggests | Video[] |

### /list
Get search results by keyword.
#### Request
| Query   | Required |
|---|---|
| keyword | Yes |
#### Response
| Field   | Data Type |
|---|---|
| status | Int |
| list | Video[] |

### /download
Get direct audio url.
#### Request
| Query   | Required |
|---|---|
| video_id | Yes |
#### Response
| Field   | Data Type |
|---|---|
| status | Int |
| url | String |
| extension | String |
