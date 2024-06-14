import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {Menu} from '../models/menu.model'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) {}

  getRoleById(roleId: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/menu/item/${roleId}`)
  }

  getMenuByItemId(itemId: number): Observable<Menu> {
    return this.http.get(`${baseUrl}/api/menu/item/${itemId}`)
  }

  fetchAllMenus(clientFk: number, roleId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(
      `${baseUrl}/api/menu/?clientFk=${clientFk}&roleId=${roleId}`
    )
  }

  createMenu(data: Menu): Observable<Menu> {
    return this.http.post(`${baseUrl}/api/menu/createMenu`, data)
  }
}
