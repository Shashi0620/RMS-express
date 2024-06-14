import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {User} from './models/user.model'
export interface InternalStateType {
  [key: string]: string
}
@Injectable({
  providedIn: 'root'
})
export class AppService {
  _state: InternalStateType = {}
  userObject: User

  setuserObject(data: User): void {
    if (data) {
      this.userObject = data
    }
  }

  getuserObject(): User {
    return this.userObject
  }
}
