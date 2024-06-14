import {Injectable} from '@angular/core'
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http'
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment'
import {FileImg} from '../models/fileimg.model'
@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData()

    formData.append('file', file)

    const req = new HttpRequest('POST', `${this.baseUrl}/`, formData, {
      reportProgress: true,
      responseType: 'json'
    })

    return this.http.request(req)
  }

  getFiles(): Observable<FileImg> {
    return this.http.get(`${this.baseUrl}/files`)
  }

  createFile(file: FileImg): Observable<FileImg> {
    return this.http.post(`${this.baseUrl}/api/file/postFile`, file)
  }

  fetchFile(user_fk: number): Observable<FileImg> {
    return this.http.get(`${this.baseUrl}/api/file/fetchFileById/${user_fk}`)
  }

  fetchTrayFile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/file/fetchTrayFile/`)
  }

  updateFile(id: number, file: FileImg): Observable<FileImg> {
    return this.http.put(`${this.baseUrl}/api/file/updateFile/${id}`, file)
  }

  updateTrayByFile(tray_fk: number, file: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/api/file//updateTrayByFile/${tray_fk}`,
      file
    )
  }

  fetchAllFiles(): Observable<FileImg[]> {
    return this.http.get<FileImg[]>(`${this.baseUrl}/files/profile`)
  }
}
