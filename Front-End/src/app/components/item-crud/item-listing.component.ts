/* eslint-disable no-self-assign */
/* eslint-disable no-undef */
/* eslint-disable filenames/match-regex */
import {SelectionModel} from '@angular/cdk/collections'
import {Component, Input} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {HttpClient} from '@angular/common/http'
import {FormService} from '../../services/app.form.service'
import {User} from '../../models/user.model'
import {Template} from '../../models/template.model'

@Component({
  selector: 'item-listing',
  templateUrl: 'item-listing.component.html'
})
export class ItemListingComponent {
  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<Template>()
  selection = new SelectionModel<any>(true, [])
  UserObj: User = {}
  clientFk = 0
  formList = false
  templateList: any
  name: string
  id: number
  trayId: number
  isQuantity: boolean

  @Input()
  trayListId: string

  @Input()
  rackId: string

  @Input()
  rackName: string

  constructor(private http: HttpClient, private formService: FormService) {}

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.retrieveTemplates()
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }

    this.selection.select(...this.dataSource.data)
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`
  }

  retrieveTemplates(): void {
    this.formService.getAll(this.clientFk).subscribe(
      data => {
        this.dataSource.data = data
        this.templateList = this.dataSource.data
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  fetchFormList(formName: string, formId: number): void {
    this.formList = true
    this.name = formName
    this.isQuantity = true
    this.id = formId
    this.rackName = this.rackName
    this.trayId = parseInt(this.trayListId)
    this.rackId = this.rackId
  }
}
