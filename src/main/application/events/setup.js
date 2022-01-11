import { Cryptor } from 'application/cryptor'
import { ipcMain, dialog } from 'electron'

export const onBackupSelect = function () {
  dialog
    .showOpenDialog({ properties: ['openFile'] })
    .then(({ filePaths, canceled }) => {
      if (canceled) return

      ipcMain.on('backup:password', (_, hashedSecret) => {
        this.cryptor = new Cryptor(hashedSecret)
        if (this.vault.import(filePaths[0], this.cryptor)) {
          this.sync.initialize(this.cryptor)
          return this.authSuccess()
        }
        this.window.webContents.send('backup:password:fail')
      })
      this.window.webContents.send('backup:loaded')
    })
    .catch(() => {})
}

export const onSetupDone = function (_, hashedSecret) {
  this.cryptor = new Cryptor(hashedSecret)
  this.vaultManager.setup(hashedSecret)
  this.sync.initialize(this.cryptor)
  return this.authSuccess()
}

export default { onBackupSelect, onSetupDone }
