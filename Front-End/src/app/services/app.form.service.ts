import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Template} from '../models/template.model'
import {Product} from 'src/app/models/form.model'
import {environment} from '../../environments/environment'
import {Item} from '../models/item.model'

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private http: HttpClient) {}

  getAll(clientFk: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/api/items?clientFk=${clientFk}`)
  }

  get(id: number): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${id}`)
  }

  getById(name: string, id: number): Observable<Template> {
    return this.http.get(`${baseUrl}/api/items/${name}/${id}`)
  }

  create(data: Item): Observable<Item> {
    return this.http.post(`${baseUrl}/api/items`, data)
  }

  saveForm(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/api/items`, data)
  }

  update(id: number, data: Item): Observable<any> {
    return this.http.put(`${baseUrl}/api/items/${id}`, data)
  }

  updateForm(
    id: number,
    name: string,
    data: any,
    menuId: number
  ): Observable<any> {
    return this.http.put(
      `${baseUrl}/api/items/${id}/${name}/?menuId=${menuId}`,
      data
    )
  }

  delete(id: number, name: string): Observable<Item> {
    return this.http.delete(`${baseUrl}/api/items/${id}/${name}`)
  }

  deleteAll(): Observable<Item> {
    return this.http.delete(`${baseUrl}/api/items`)
  }

  findByTitle(name: string): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}/api/items?name=${name}`)
  }

  createForm(data: any, tempName: string): Observable<any> {
    return this.http.post(`${baseUrl}/api/form?tempName=${tempName}`, data)
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form`)
  }

  getAllProductsByItemTempId(
    itemTempId: number,
    formName: string
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${baseUrl}/api/form?itemTempId=${itemTempId}&formName=${formName}`
    )
  }

  getFormData(id: number): Observable<Product> {
    return this.http.get(`${baseUrl}/api/form/${id}`)
  }

  getFormDataByName(id: number, name: string): Observable<Product> {
    return this.http.get(`${baseUrl}/api/form/${id}/${name}`)
  }

  updateFormData(id: string, data: any, name: string): Observable<any> {
    return this.http.put(`${baseUrl}/api/form/${id}/${name}`, data)
  }

  deleteFormData(id: number, name: string): Observable<any> {
    return this.http.delete(`${baseUrl}/api/form/${id}/${name}`)
  }

  findByFormsName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${baseUrl}/api/form?name=${name}`)
  }

  templateValidation(value: string): Observable<any> {
    return this.http.get(`${baseUrl}/api/items/template/validate/${value}`)
  }

  getMenyById(templateID: number): Observable<any> {
    return this.http.get(
      `${baseUrl}/api/menu/fetchMenu/?templateID=${templateID}`
    )
  }

  fetchAllTemplates(): Observable<Template> {
    return this.http.get(`${baseUrl}/api/form/fetchAllTemplates/`)
  }
}
