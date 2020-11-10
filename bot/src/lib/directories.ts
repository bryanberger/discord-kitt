import fs from 'fs-extra'
import path from 'path'

export const ensureDirectories = () => {
  try {
    fs.ensureDirSync(path.join(__dirname, '../tmp')) // dist/tmp
    console.log('tmp directory created/exists.')
  } catch (err) {
    console.error(err)
  }
}
