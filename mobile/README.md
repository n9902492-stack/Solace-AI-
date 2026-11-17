# Solace Mobile

React Native and Expo app for the mobile assignment. The repository root contains the Next.js prototype.

## Start

```sh
cd mobile
npm ci
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

## Daily reminders

Open Home → Reminders. Set a local time in HH:MM format for a mood check-in
or breathing break. You can change the time or turn either reminder off.
Reminders use the device notification scheduler and apply to the device.
Tapping one opens Check-in or Breathe after account access is restored.

- `src/reminders/RemindersScreen.tsx` handles time input and feedback.
- `src/reminders/schedule.ts` owns permissions, scheduling and cancellation.
- `App.tsx` reads notification taps and opens the corresponding screen.

Verify on a physical Android and iOS device with notifications enabled:
schedule both reminders, change one time, and check delivery and navigation
in the foreground, background, and after closing the app.

## Android APK for the demo

Run these commands from `mobile/` with your Expo account:

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://YOUR-API-HOST --visibility plaintext
npx eas-cli build --platform android --profile preview
```

Replace the example URL with the deployed Solace API URL. Keep the Node.js API
running behind HTTPS with persistent storage for `server/data/`. The API URL
is public configuration bundled into the app. The preview profile produces
an installable APK. Download it from the completed EAS build and install it on
an Android phone.

Before recording the demo, check on that phone:

1. Create an account, relaunch the app, log out, and log back in.
2. Save a mood and confirm it remains in Recent check-ins after relaunch.
3. Start a Zen Monk chat, resume it, and delete it. For the live AI demo,
   enable the local model on the API host and verify an actual model reply.
4. Schedule a reminder for a nearby time, background or close the app
   normally, then check delivery and tap routing. Test both reminder types.

## Desktop recording

Use two PowerShell terminals. From the repository root, start the local API:

```powershell
$env:SOLACE_DESKTOP_ORIGIN = "http://localhost:8081"
npm --prefix server start
```

In a second terminal, from the repository root:

```powershell
cd mobile
npm ci
$env:EXPO_PUBLIC_API_URL = "http://localhost:4000"
npx expo start --web --port 8081
```

Open http://localhost:8081 in Chrome or Edge and create a demo account. The
browser uses the local SQLite database. Keep both terminals running while
recording. Browser reminders need notification permission and an open signed-in
tab. Actual AI replies still require the local model setup above.
