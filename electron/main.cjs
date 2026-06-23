const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "BacaYukz",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'icon.png')
    });

    // Target URL Configuration
    // In production, you would typically load the live URL of your deployed application
    let targetUrl = 'http://127.0.0.1:8000';

    // Parse CLI arguments (e.g., electron . --url=https://bacayukz.com)
    const urlArg = process.argv.find(arg => arg.startsWith('--url='));
    if (urlArg) {
        targetUrl = urlArg.split('=')[1];
    } else if (process.env.APP_URL) {
        targetUrl = process.env.APP_URL;
    }

    mainWindow.loadURL(targetUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Custom Application Menu
    const menuTemplate = [
        {
            label: 'Aplikasi',
            submenu: [
                { label: 'Tentang BacaYukz', role: 'about' },
                { type: 'separator' },
                { label: 'Keluar', role: 'quit' }
            ]
        },
        {
            label: 'Navigasi',
            submenu: [
                { label: 'Muat Ulang', role: 'reload' },
                { label: 'Paksa Muat Ulang', role: 'forcereload' },
                { type: 'separator' },
                { 
                    label: 'Kembali', 
                    accelerator: 'Alt+Left', 
                    click: () => { 
                        if (mainWindow && mainWindow.webContents.canGoBack()) {
                            mainWindow.webContents.goBack(); 
                        }
                    } 
                },
                { 
                    label: 'Maju', 
                    accelerator: 'Alt+Right', 
                    click: () => { 
                        if (mainWindow && mainWindow.webContents.canGoForward()) {
                            mainWindow.webContents.goForward(); 
                        }
                    } 
                }
            ]
        },
        {
            label: 'Tampilan',
            submenu: [
                { label: 'Perbesar', role: 'zoomin' },
                { label: 'Perkecil', role: 'zoomout' },
                { label: 'Reset Zoom', role: 'resetzoom' },
                { type: 'separator' },
                { label: 'Layar Penuh', role: 'togglefullscreen' },
                { label: 'Developer Tools', role: 'toggleDevTools' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
