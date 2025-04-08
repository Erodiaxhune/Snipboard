import { Level } from 'level'
import { DbPath } from '../utils'

const LocalDB = new Level(DbPath())
export const snipboard = LocalDB.sublevel('snipboard')

export default LocalDB
