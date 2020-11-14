import fs from 'fs-extra'
import path from 'path'

export const ensureDirectories = () => {
  try {
    fs.ensureDirSync(path.join(__dirname, '../tmp'))
    fs.ensureDirSync(path.join(__dirname, '../settings'))
    fs.ensureDirSync(path.join(__dirname, '../cache'))
    console.log('Directories ensured!')
  } catch (err) {
    console.error(err)
  }
}
