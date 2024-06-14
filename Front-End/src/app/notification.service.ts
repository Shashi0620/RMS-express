/* eslint-disable filenames/match-regex */
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../environments/environment'
import {Notification} from './models/notification.model'
import {NotificationSetting} from './models/notificationSetting.model'
const baseUrl = environment.baseUrl
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post(
      `${baseUrl}/api/notification/createNotification`,
      notification
    )
  }

  createNotificationSetting(
    notificationSettings: NotificationSetting
  ): Observable<NotificationSetting> {
    return this.http.post(
      `${baseUrl}/api/notificationSetting/createNotificationSetting`,
      notificationSettings
    )
  }

  fetchNotificationByStoreFk(storeFk: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${baseUrl}/api/notificationSetting/fetchNotificationByStoreFk/${storeFk}`
    )
  }

  fetchALLNotification(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${baseUrl}/api/notificationSetting/fetchNotificationSettingByStoreFkNotNull`
    )
  }

  fetchNotificationById(id: number): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/notification/fetchNotificationById/${id}`
    )
  }

  fetchNotificationSettingById(id: number): Observable<NotificationSetting> {
    return this.http.get(
      `${baseUrl}/api/notificationSetting/fetchNotificationSettingById/${id}`
    )
  }

  deleteNotificationSetting(id: number): Observable<any> {
    return this.http.delete(
      `${baseUrl}/api/notificationSetting/deleteNotificationSetting/${id}`
    )
  }
}
