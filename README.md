# V2Ray Subscription Manager

A simple Node.js (ESModules) backend service to manage multiple V2Ray subscription links and raw configs.  
It merges all your subscriptions into a single unified subscription URL that you can add to any V2Ray client app.

---

## Features

- Add raw V2Ray configs (vmess://, vless://, etc.) manually
- Add subscription URLs containing multiple configs
- Automatically fetch and update subscription URLs every 30 minutes
- Merge all configs into a single base64-encoded subscription list
- Store data persistently using SQLite
- Simple REST API to manage nodes and subscriptions
- Dockerized for easy deployment

---

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- Or Node.js 20+ installed locally

---

### Installation & Running with Docker

1. Clone this repo:

```bash
git clone <repo-url>
cd v2ray-sub-manager
```

2. Build and start the container:

```bash
docker compose up --build
```

3. The service will be available at http://localhost:3000

---

### Running Locally without Docker

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

---

## API Reference

### 1. Add a Raw V2Ray Config

**POST** `/api/nodes`  
Adds a single raw V2Ray config line manually.

Request body (JSON):

```bash
{
  "type": "vmess",
  "raw": "vmess://base64encodedstring"
}
```

Example with curl:

```bash
curl -X POST http://localhost:3000/api/nodes \
  -H "Content-Type: application/json" \
  -d '{"type":"vmess","raw":"vmess://base64encodedstring"}'
```

---

### 2. Add a Subscription URL

**POST** `/api/subscriptions`  
Adds a remote subscription URL that contains multiple configs.

Request body (JSON):

```bash
{
  "url": "https://example.com/path/to/subscription"
}
```

Example with curl:

```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/sub.txt"}'
```

---

### 3. Get the Combined Subscription List

**GET** `/api/merged`  
Returns a base64-encoded list combining all nodes from raw configs and subscription links.

Example:

```bash
curl http://localhost:3000/api/merged
```

---

## Automatic Subscription Updates

- Subscription URLs are updated every 30 minutes automatically.
- New configs are added; duplicates are ignored.

---

## Database

SQLite database stored at `./db/database.sqlite`.

- `nodes` table: stores raw configs and metadata
- `subscriptions` table: stores subscription URLs and last fetch timestamps

---

## Docker Details

- Exposes port `3000`
- Persists DB in `./db` (mounted in Docker volume)

---

## Example Usage Summary

| Action                    | Endpoint                | Body Example                      |
| ------------------------- | ----------------------- | --------------------------------- |
| Add raw config            | POST /api/nodes         | { "type": "vmess", "raw": "..." } |
| Add subscription URL      | POST /api/subscriptions | { "url": "https://..." }          |
| Get combined subscription | GET /api/merged         | _(no body needed)_                |

---

## Troubleshooting

- Errors during subscription fetch are logged.
- Duplicate nodes are skipped.

---

## Future Improvements

- Frontend panel
- Shadowsocks/Trojan support
- API auth
- Tags and grouping
- QR code generator

---

## License

MIT

---

## Author

Your Name — your.email@example.com

---

Happy tunneling! 🔐
