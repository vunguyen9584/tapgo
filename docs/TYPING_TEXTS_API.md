# Typing Texts API (v1)

Backend API that serves typing texts for the “Typing test” mode. Each request returns 20 texts by default; the frontend consumes them sequentially and requests more when exhausted.

## Base URL

```
/api/v1
```

## GET /typing-texts

Returns a batch of typing texts.

- Default batch size: 20 items
- Items are suitable for general typing tests (quotes/sentences)

### Query parameters

- `limit` (optional, integer, 1..50, default 20): number of texts to return
- `lang` (optional, string): `en` | `vi` (language of texts)
- `minLength` (optional, integer): minimum number of characters per text
- `maxLength` (optional, integer): maximum number of characters per text
- `cursor` (optional, string): opaque token for pagination/continuation; pass the `nextCursor` from the previous response to get the next batch

Notes:
- If `cursor` is omitted, a new stream is started.
- If there are not enough items to satisfy `limit`, fewer items may be returned; request again with the returned `nextCursor`.

### Response (200)

```json
{
  "items": [
    {
      "id": "tx_01H...",
      "text": "The quick brown fox jumps over the lazy dog.",
      "language": "en",
      "length": 44
    }
  ],
  "count": 20,
  "nextCursor": "eyJvZmZzZXQiOjIwfQ=="
}
```

Field descriptions:
- `items`: array of texts
  - `id`: unique id for the text
  - `text`: the content to type
  - `language`: language code of the text (if known)
  - `length`: character count of `text`
- `count`: number of items returned
- `nextCursor`: opaque string to fetch the next page; may be absent/null if no more items

### Errors

- 400 Bad Request — invalid parameters
- 429 Too Many Requests — rate limit exceeded
- 500 Internal Server Error — unexpected error

Error body:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "limit must be between 1 and 50"
  }
}
```

### Examples

Request 20 English texts with length between 40 and 160 chars:

```
GET /api/v1/typing-texts?limit=20&lang=en&minLength=40&maxLength=160
```

Paginate using the returned cursor:

```
GET /api/v1/typing-texts?cursor=eyJvZmZzZXQiOjIwfQ==
```

### CORS

Enable CORS for your frontend origin (e.g., `http://localhost:5173`) if the API is hosted on a different domain.

### Versioning

- Current versioned path: `/api/v1/…`
- Breaking changes will use `/api/v2/…`.
