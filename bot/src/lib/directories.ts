import fs from 'fs-extra'
import path from 'path'

export const ensureDirectories = () => {
  try {
    fs.ensureDirSync(path.join(__dirname, '../tmp')) // dist/tmp
    fs.ensureDirSync(path.join(__dirname, '../settings')) // dist/settings
    console.log('Directories ensured!')
  } catch (err) {
    console.error(err)
  }
}
