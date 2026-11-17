# Solace Mobile

React Native and Expo app for the mobile assignment. The repository root contains the Next.js prototype.

## Start

```sh
cd mobile
npm install
npm start
```

Open the project with a compatible Expo client or emulator.

The opening and onboarding lead to account creation or login and a personalized Home preview.

Opening photo by [Nguyen Bui on Unsplash](https://unsplash.com/photos/green-leafed-plant-gvioN_GyOOk).

## Sign up and login

Start the API from the repository root using Node.js 24 or newer:

```sh
npm --prefix server start
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env.local`. For the Android emulator
on the same machine, use `http://10.0.2.2:4000` and bind the API with
`HOST=0.0.0.0`. For a physical phone, use a reachable HTTPS API URL.
Restart Expo after changing this variable. APK and TestFlight builds should
use an HTTPS deployment.

SQLite creates its database in `server/data/` at startup. The app stores
the session token in Expo SecureStore and checks it on launch.

## Optional local AI replies

Run Ollama on the same machine as the Node.js API, with Ollama cloud features
disabled. Pull the local model with `ollama pull qwen2.5:3b`. Set
`SOLACE_LOCAL_AI=1` in the API process environment and restart the API.
The API connects only to Ollama on loopback and includes the last eight messages
from the open conversation. If the local model is disabled or unavailable,
Zen Monk saves a labeled guided prompt instead.
