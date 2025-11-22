const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const PINTEREST_URL = 'https://www.pinterest.com';
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        show: false,
        title: "Pinterest",
        trafficLightPosition: { x: 14, y: 14 },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15';
    mainWindow.loadURL(PINTEREST_URL, { userAgent });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        try {
            const allowed = new URL(PINTEREST_URL).host;
            const host = new URL(url).host;
            if (host.includes(allowed)) return { action: 'allow' };
        } catch (e) { }
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.includes(new URL(PINTEREST_URL).host)) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.on('closed', () => (mainWindow = null));

    const template = [
        ...(process.platform === 'darwin' ? [{
            label: app.name,
            submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }]
        }] : []),
        {
            label: 'View',
            submenu: [{ role: 'reload' }, { role: 'forcereload' }, { role: 'toggledevtools' }]
        },
        { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'close' }] }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {

    if (!app.requestSingleInstanceLock()) {
        app.quit();
        return;
    }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
