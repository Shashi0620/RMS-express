/* eslint-disable filenames/match-regex */
import {Store} from './store.model'

export class Staff {
  id?: number
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  selectedStores?: Store[]
}
