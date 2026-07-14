# Docker Troubleshooting Guide

This guide explains how to resolve common Docker and Docker Compose errors encountered during the ResuMesh build process.

## 1. Error: Cannot connect to the Docker daemon

### Symptom
```bash
Cannot connect to the Docker daemon at unix:///Users/atacan/.docker/run/docker.sock. Is the docker daemon running?
```

### Solution
This error indicates that the Docker Desktop daemon is not running on your machine.
- Open **Docker Desktop** from your Applications folder.
- Wait until the status indicator in the bottom-left corner turns green (showing "Engine Running").
- Once started, rerun the command:
  ```bash
  docker compose up --build -d
  ```

---

## 2. Error: `docker-credential-desktop` executable file not found

### Symptom
```bash
failed to solve: error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH
```

### Cause
This occurs when Docker's configuration file (`~/.docker/config.json`) specifies `desktop` as the credential helper, but the path is not configured correctly or the Desktop helper is not in your current shell's PATH.

### Solution

#### Method A: Update the Credential Store in Docker Configuration (Recommended)
1. Open your Docker configuration file in a text editor (e.g. VS Code, nano):
   ```bash
   nano ~/.docker/config.json
   ```
2. Locate the line containing `"credsStore"`:
   ```json
   "credsStore": "desktop"
   ```
3. Change it to use the macOS native keychain helper (`osxkeychain`):
   ```json
   "credsStore": "osxkeychain"
   ```
4. Save and exit (for nano, press `Ctrl+O`, `Enter`, then `Ctrl+X`).
5. Re-run your docker compose command.

#### Method B: Remove the Helper Configuration (Alternative)
If changing it to `osxkeychain` does not work, you can remove the helper option entirely:
1. Open `~/.docker/config.json`.
2. Remove the line:
   ```json
   "credsStore": "desktop"
   ```
   *(Make sure to fix any trailing commas in the JSON so that it remains valid syntax).*
3. Save the file and rebuild.
