import fs from 'fs-extra'
import path from 'path'

export const ensureDirectories = () => {
  try {
    fs.ensureDirSync(path.join(__dirname, '../../settings'))
    console.log(path.join(__dirname, '../../settings'))
    console.log('Directories ensured!')
  } catch (err) {
    console.error(err)
  }
}
