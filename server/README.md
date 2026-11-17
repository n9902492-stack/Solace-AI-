# Solace API deployment

The mobile client needs an HTTPS URL for the Node.js API. Deploy `server/`
as a single service with a persistent disk for SQLite.

| Setting | Value |
| --- | --- |
| Runtime | Node.js 24 or later |
| Start command | `npm start` from `server/` |
| Bind address | `HOST=0.0.0.0` |
| Port | `PORT` supplied by the host, or 4000 |
| Database directory | `SOLACE_DATA_DIR`, set to a writable directory on the persistent disk |
| HTTP health check | `GET /health` |

To run a container locally from the repository root:

```sh
docker build -t solace-api server
docker run --rm -p 127.0.0.1:4000:4000 -v solace-data:/app/data solace-api
```

After deploying, check that `https://<api-host>/health` returns
`{"status":"ok"}`. Set the resulting HTTPS base URL as
`EXPO_PUBLIC_API_URL` in the EAS preview environment before building the APK.

The container starts with guided prompts available. To demonstrate generated
replies, deploy the Node.js process and the local Ollama model on the same host
and network namespace. The API looks for Ollama at `127.0.0.1:11434`.
See the mobile README for model setup.
