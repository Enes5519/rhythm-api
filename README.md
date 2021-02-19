# rhythm-api
rhyrhm-api is a youtube extractor api. With this API, you can get search suggestions, video lists, and download those videos.

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
