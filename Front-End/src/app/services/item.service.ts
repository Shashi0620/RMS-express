import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {Item} from '../models/item.model'
const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) {}

  getItemById(id: number): Observable<Item> {
    return this.http.get(`${baseUrl}/api/items/${id}`)
  }
}
