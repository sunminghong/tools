/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var app = require('app');
var BrowserWindow = require('browser-window');
const ipcMain = require('electron').ipcMain;

var win = null;
var flags = {
  devTools: false,
  fullscreen: false
};

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
  return true;
});

if (shouldQuit) {
  app.quit();
  return;
}

app.on('will-finish-launching', function() {
  require('crash-reporter').start({
    productName: 'Viewer',
    companyName: 'SFBASoft, Inc',
    submitURL: 'https://sfbasoft.com/post',
    autoSubmit: true
  });

  // TODO: Auto Updater
});

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: process.platform === 'win32',
    transparent: false
  });
  win.loadURL('file://' + __dirname + '/index.html');
  win.on('closed', function() {
    win = null;
  });
});

ipcMain.on('toggleDevTools', function(event, arg) {
  if (flags['devTools']) {
    win.webContents.closeDevTools();
  } else {
    win.webContents.openDevTools();
  }
  flags['devTools'] = !flags['devTools'];
});

ipcMain.on('maximize', function(event, arg) {
  win.maximize();
});

ipcMain.on('minimize', function(event, arg) {
  win.minimize();
});

ipcMain.on('toggleFullScreen', function(event, arg) {
  flags['fullScreen'] = !flags['fullScreen'];
  win.setFullScreen(flags['fullScreen']);
});
