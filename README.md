# pinterest desktop app for mac 🕺
hi !! made this because pinterest does not have a desktop app for mac

this is a simple electron wrapper around the official pinterest website.

to use it, just download and install the dmg file.

### if mac says "is damaged and can't be opened"

mac may block unsigned apps. you have to remove the quarantine flag so it opens normally.
### option a — after installing
1. drag `Pinterest Desktop.app` into `Applications`
2. instead of double clicking to open the app, right-click and open it to allow macos to trust this app and it won't cause any issues in the future.

### option b — after installing
1. drag `Pinterest Desktop.app` into `Applications`
2. open Terminal and run:
```bash
sudo xattr -rd com.apple.quarantine "/Applications/Pinterest Desktop.app"
