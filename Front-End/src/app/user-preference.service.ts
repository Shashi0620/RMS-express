import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../environments/environment'
import {UserPreference} from './models/userpreference.model'
import {HttpClient} from '@angular/common/http'

const baseUrl = environment.baseUrl
@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {
  constructor(private http: HttpClient) {}

  createUserPreference(data: UserPreference): Observable<UserPreference> {
    return this.http.post(
      `${baseUrl}/api/userPreference/createUserPreference`,
      data
    )
  }

  getAllSelectedColumns(
    templateId: number,
    userFk: number
  ): Observable<UserPreference[]> {
    return this.http.get<UserPreference[]>(
      `${baseUrl}/api/userPreference/fetchAllSelectedColumns/${templateId}/${userFk}`
    )
  }

  updateSelectedColumns(
    id: number,
    data: UserPreference
  ): Observable<UserPreference> {
    return this.http.put(`${baseUrl}/api/userPreference/${id}`, data)
  }
}
