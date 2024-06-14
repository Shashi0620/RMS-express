import {Client} from './../client'
import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {Rack} from '../models/rack.model'
import {Tray} from '../models/tray.model'
import {TrayItem} from '../models/trayItem.model'
import {KtdGridLayout} from '@katoid/angular-grid-layout'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class RackService {
  constructor(private http: HttpClient) {}

  getRackById(id: number): Observable<Rack> {
    return this.http.get(`${baseUrl}/api/rack/fetchRackById/${id}`)
  }

  deleteRackById(id: number): Observable<Rack> {
    return this.http.delete(`${baseUrl}/api/rack/${id}`)
  }

  deleteTrayById(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/api/rack/tray/${id}`)
  }

  searchRack(data: string): Observable<Rack> {
    return this.http.post(`${baseUrl}/api/rack/searchRack`, data)
  }

  createRack(rackData: Rack): Observable<Rack> {
    return this.http.post(`${baseUrl}/api/rack/createRack`, rackData)
  }

  createTray(trayData: Tray): Observable<Tray> {
    return this.http.post<Tray>(`${baseUrl}/api/rack/tray`, trayData)
  }

  updateTray(id: number, trayObject: Tray): Observable<Tray> {
    return this.http.put<Tray>(
      `${baseUrl}/api/rack/tray/` + `${id}`,
      trayObject
    )
  }

  updateRack(id: number, rackObject: Rack): Observable<Rack> {
    return this.http.put(`${baseUrl}/api/rack/` + `${id}`, rackObject)
  }

  fetchTrayById(id: number): Observable<Tray> {
    return this.http.get<Tray>(`${baseUrl}/api/rack/tray/${id}`)
  }

  fetchAllRacks(client_fk: number): Observable<Rack[]> {
    return this.http.get<Rack[]>(`${baseUrl}/api/rack/${client_fk}`)
  }

  saveTrayLayout(trayList: Tray[], trayId: number): Observable<Tray> {
    return this.http.put<Tray>(
      `${baseUrl}/api/rack/tray/props/${trayId}`,
      trayList
    )
  }

  getTrayPropById(id: number): Observable<any> {
    return this.http.get(`${baseUrl}/api/rack/traylisting/props/${id}`)
  }

  getTrayDataById(rack_fk: number): Observable<Tray[]> {
    return this.http.get<Tray[]>(
      `${baseUrl}/api/rack/traylisting/data/${rack_fk}`
    )
  }

  createTrayItems(trayItem: TrayItem): Observable<any> {
    return this.http.post(`${baseUrl}/api/trayItem/createTrayItem`, trayItem)
  }

  updateTrayItem(trayId: number, trayItem: TrayItem): Observable<TrayItem> {
    return this.http.put(`${baseUrl}/api/trayItem/` + `${trayId}`, trayItem)
  }

  fetchTemplateAndTrayById(tempId: number, trayId: number): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/trayItem/fetchTemplateAndTrayById/${tempId}/${trayId}`
    )
  }

  fetchAllItems(): Observable<any> {
    return this.http.get(`${baseUrl}/api/trayItem/findAllItems`)
  }

  fetchTrayTemplateAndFormById(
    trayId: number,
    tempId: number,
    formId: number
  ): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/trayItem/fetchTrayTemplateAndFormById/${trayId}/${tempId}/${formId}`
    )
  }

  fetchTrays(search: string): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/rack/tray/items?searchString=${search}`
    )
  }
  deleteTrayItem(id: number) {
    return this.http.delete(`${baseUrl}/api/rack/DeleteTrayItem/${id}`)
  }
}
