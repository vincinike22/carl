# Carl backend deploy and restart notes

These are the exact steps to get Carl working again if the app stops talking to the backend, if the VPS process dies, or if you forget the setup later.

## 1. SSH into the VPS

From your Mac terminal:

```bash
ssh -i ~/.ssh/id_ed25519 root@89.167.5.112
```

## 2. Go to the backend folder

```bash
cd /opt/carl-backend
ls -la
```

You should see files like:
- `server.js`
- `package.json`
- `.env`
- `node_modules`

## 3. Check whether the backend is running

```bash
ps aux | grep node
```

A healthy running process looks roughly like:

```bash
/usr/bin/node /opt/carl-backend/server.js
```

## 4. If needed, inspect the current backend

```bash
sed -n '1,240p' /opt/carl-backend/server.js
cat /opt/carl-backend/package.json
cat /opt/carl-backend/.env
```

Do not paste secrets publicly.

## 5. Restart the backend manually

Kill the old process:

```bash
pkill -f "/opt/carl-backend/server.js"
```

Start it again:

```bash
cd /opt/carl-backend
nohup node server.js > carl.log 2>&1 &
```

## 6. Verify that it started

```bash
ps aux | grep node
curl http://localhost:8787/health
```

Expected health response looks like:

```json
{"ok":true,"model":"stepfun/step-3.5-flash:free","sessions":0}
```

## 7. Test the chat endpoint directly on the VPS

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","message":"I feel off today"}'
```

If the backend is healthy, this should return JSON with at least:
- `reply`
- `userId`
- `model`
- maybe `mode`
- maybe `risk`

## 8. Watch logs while testing from the app

```bash
tail -f /opt/carl-backend/carl.log
```

Use this while sending messages from the simulator or app.

## 9. If the app says it cannot reach the server

Check these in order:

### A. App Transport Security in Xcode
In the app target Info settings, make sure:

- `App Transport Security Settings`
  - `Allow Arbitrary Loads` = `YES`

This is needed because the app is calling plain HTTP:

```text
http://89.167.5.112:8787/chat
```

### B. Confirm the app code is actually using the VPS URL
Search for:
- `89.167.5.112`
- `/chat`
- `URLSession`
- `sendConversation()`

### C. Confirm the VPS port is reachable
From your Mac terminal:

```bash
curl http://89.167.5.112:8787/health
```

If that fails from your Mac, the app will fail too.

## 10. If you need to edit the backend code on the VPS

Make a backup first:

```bash
cd /opt/carl-backend
cp server.js server.js.bak
nano server.js
```

After editing, restart it:

```bash
pkill -f "/opt/carl-backend/server.js"
nohup node /opt/carl-backend/server.js > /opt/carl-backend/carl.log 2>&1 &
```

## 11. If the Mac is unplugged or closed

The VPS backend can still run because it lives on the server, not on your Mac.

What matters is that the VPS process is running.

To restore service later, just:

1. SSH into the VPS
2. Restart the backend with the commands above
3. Test `/health`
4. Test `/chat`

## 12. Recommended future improvement

Right now the backend is started manually with `nohup`. That works, but it is fragile.

Better long-term options:
- `pm2`
- `systemd`

That way it will automatically restart after crashes or server reboots.

## 13. Important security note

If an API key was ever pasted into chat or committed somewhere unsafe, rotate it and update `.env` on the VPS.

Keep secrets in:
- `.env`

Do not hardcode them into:
- `server.js`
- the iOS app
- public repos
