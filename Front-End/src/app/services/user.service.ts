import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
import {User} from '../models/user.model'
import {Staff} from '../models/staff.model'
import {Plan} from '../models/plan.model'
import {Notification} from '../models/notification.model'
import {Client} from '../models/client.model'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(data: User): Observable<User> {
    return this.http.post(`${baseUrl}/api/user`, data)
  }

  login(data: User): Observable<User> {
    return this.http.post(`${baseUrl}/api/user` + `/login`, data)
  }

  createClient(data: Client): Observable<Client> {
    return this.http.post(`${baseUrl}/api/user` + `/client`, data)
  }

  resetPassword(data: User): Observable<User> {
    return this.http.post(`${baseUrl}/api/user/client/resetPassword`, data)
  }

  backendValidation(value: string, type: string): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/user/client/validation/${value}/${type}`
    )
  }

  saveClientStaff(clientName: string, data: Staff): Observable<Staff> {
    return this.http.post(
      `${baseUrl}/api/user/client/staff/save/${clientName}`,
      data
    )
  }

  getStaffRole(): Observable<Staff> {
    return this.http.get(`${baseUrl}/api/user/client/staff/role`)
  }

  getClientStaffList(clientFk: number, roleId: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${baseUrl}/api/user/client/staff?clientFk=${clientFk}&roleId=${roleId}`
    )
  }

  getClientName(clientFk: number): Observable<Staff> {
    return this.http.get(`${baseUrl}/api/user/client/name?clientFk=${clientFk}`)
  }

  get(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/client/staff/${id}`)
  }

  updateClientStaff(id: number, data: Staff): Observable<Staff> {
    return this.http.put(`${baseUrl}/api/user/client/staff/update/${id}`, data)
  }

  delete(id: number): Observable<Staff> {
    return this.http.delete(`${baseUrl}/api/user/client/staff/delete/${id}`)
  }

  getPlansList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${baseUrl}/api/user/client/plans`)
  }

  getRoleNameByID(roleId: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/role?roleId=${roleId}`)
  }

  getPlanByID(palnId: number): Observable<Plan> {
    return this.http.get<Plan>(`${baseUrl}/api/user/plan?palnId=${palnId}`)
  }

  getClientList(clientId: number): Observable<Client> {
    return this.http.get(`${baseUrl}/api/user/client/fetchdata/${clientId}`)
  }

  fetchNotificationByUserFk(userFk: number): Observable<Notification> {
    return this.http.get(
      `${baseUrl}/api/notification/fetchNotificationByUserFk/${userFk}`
    )
  }

  saveData(data, username) {
    return this.http.post(`${baseUrl}/api/user/translateData/${username}`, data)
  }
  getAllMenuData(username: string): Observable<any> {
    return this.http.get(`${baseUrl}/api/user/getData/${username}`)
  }

  updateUserElasticSearchUrl(
    userPk: number,
    elasticSearch: any
  ): Observable<any> {
    return this.http.put(
      `${baseUrl}/api/user/updateUserElasticSearchUrl/${userPk}`,
      elasticSearch
    )
  }
}
