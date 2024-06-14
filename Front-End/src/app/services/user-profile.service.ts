import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
import {Notification} from '../models/notification.model'
import {Profile} from '../models/userProfile.model'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  createUserProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(
      `${baseUrl}/api/profile/createProfile`,
      profile
    )
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(
      `${baseUrl}/api/user/notification`,
      notification
    )
  }

  updateProfile(id: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${baseUrl}/api/profile/` + `${id}`, profile)
  }

  updatePassword(user_fk: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(
      `${baseUrl}/api/profile/updatePassword/` + `${user_fk}`,
      profile
    )
  }

  fetchProfileByUserFK(user_fk: number): Observable<Profile> {
    return this.http.get<Profile>(
      `${baseUrl}/api/profile/fetchProfileByUserFK/${user_fk}`
    )
  }

  fetchProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(
      `${baseUrl}/api/profile/fetchProfileById/${id}`
    )
  }
}
