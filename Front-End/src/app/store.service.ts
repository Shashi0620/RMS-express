import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {environment} from '../environments/environment'
import {Store} from './models/store.model'
const baseUrl = environment.baseUrl
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getStoreById(storeId: number): Observable<Store> {
    return this.http.get(`${baseUrl}/api/store/fetchStoreById/${storeId}`)
  }
  fetchAllStoresByClientFK(client_fk: number): Observable<Store[]> {
    return this.http.get<Store[]>(
      `${baseUrl}/api/store/fetchAllStoresByClientFK/${client_fk}`
    )
  }

  deleteStoreById(storeId: number): Observable<any> {
    return this.http.delete(`${baseUrl}/api/store/${storeId}`)
  }

  createStore(store: Store): Observable<Store> {
    return this.http.post(`${baseUrl}/api/store/createStore`, store)
  }

  updateStore(storeId: number, store: Store): Observable<Store> {
    return this.http.put<Store>(
      `${baseUrl}/api/store/updateById/` + `${storeId}`,
      store
    )
  }
}
