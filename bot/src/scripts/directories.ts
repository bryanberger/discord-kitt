import fs from 'fs-extra'
import path from 'path'

export default () => {
  try {
    fs.ensureDirSync(path.join(__dirname, '../../settings'))
    console.log('Directories ensured!')
  } catch (err) {
    console.error(err)
  }
}
