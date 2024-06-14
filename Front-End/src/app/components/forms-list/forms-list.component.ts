import {Component, OnInit, ViewChild} from '@angular/core'
import {Product} from '../../models/form.model'
import {FormService} from './../../services/app.form.service'
import {ActivatedRoute, Router} from '@angular/router'
import {MatTableDataSource} from '@angular/material/table'
import swal from 'sweetalert2'
import {HttpClient} from '@angular/common/http'
import {MatPaginator} from '@angular/material/paginator'
import {environment} from 'src/environments/environment'
import {UserPreference} from '../../models/userpreference.model'
import {UserPreferenceService} from '../../user-preference.service'
import {AlertService} from '../_alert'
import {User} from 'src/app/models/user.model'
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast'
const columnLength = environment.columnLength
const frontendUrl = environment.frontendBaseUrl
interface CustomColumn {
  possition: number
  name: string
  isActive: boolean
}

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormListComponent implements OnInit {
  products?: Product[]
  columnShowHideList: CustomColumn[] = []
  currentTemplate?: Product
  currentIndex = -1
  name = ''
  tempid = 0
  clientFk = 0
  UserObj: User = {}
  templateName: string
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  userPreference: UserPreference = {
    id: 0,
    userFk: 0,
    templateId: 0,
    selectedColumns: ''
  }

  userSelectedColumns: string[]

  showHideColumn = false

  displayedColumns: string[] = []
  selectedColumns = this.displayedColumns.toString()

  @ViewChild(MatPaginator) paginator: MatPaginator
  allColumns: string
  formName: string
  constructor(
    private formService: FormService,
    private alertService: AlertService,
    private userPreferenceService: UserPreferenceService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    route.params.subscribe(val => {
      this.tempid = this.route.snapshot.params['id']

      this.retrieveForms()
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
      this.clientFk = this.UserObj.clientFk
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  dataSource = new MatTableDataSource<any>()

  ngOnInit(): void {
    //this.getData();
    this.tempid = this.route.snapshot.params['id']
    this.retrieveForms()
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.retrieveSelectedColumns(this.tempid, this.UserObj.id)
  }

  retrieveForms(): void {
    this.formName = this.route.snapshot.params.name
    this.formService
      .getAllProductsByItemTempId(this.tempid, this.route.snapshot.params.name)
      .subscribe(data => {
        this.extractData(data)
        this.retrieveSelectedColumns(this.tempid, this.UserObj.id)
      })
  }

  refreshList(): void {
    this.retrieveForms()
    this.currentTemplate = undefined
    this.currentIndex = -1
  }

  setActiveTemplate(Template: Product, index: number): void {
    this.currentTemplate = Template
    this.currentIndex = index
  }

  removeAllTemplates(): void {
    this.formService.deleteAll().subscribe(
      () => {
        this.refreshList()
      },
      error => {
        console.log(error)
      }
    )
  }

  searchTitle(): void {
    this.currentTemplate = undefined
    this.currentIndex = -1

    this.formService.findByFormsName(this.name).subscribe(
      data => {
        this.products = data
      },
      error => {
        console.log(error)
      }
    )
  }

  deleteFormData(id): void {
    this.formService
      .deleteFormData(id, this.route.snapshot.params.name)
      .subscribe(
        response => {
          this.alertService.error(response.message, this.options)

          this.formService.getAll(this.clientFk)
          this.router.navigate(['/template'])
        },
        error => {
          this.alertService.error(error.error.message, this.options)
          console.log(error)
        }
      )
  }

  removeForm(id): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this form?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteFormData(id)
      }
    })
  }

  addNewForm(): void {
    this.router.navigate([
      `/addForm/${this.route.snapshot.params.name}/${this.tempid}`
    ])
  }

  private extractData(serverData): void {
    const rowDataList: any = []
    if (serverData != null) {
      serverData.forEach(dbRecord => {
        let rowdata
        //Prepare Row Data
        rowdata = Object.assign({id: dbRecord.id})
        // rowdata = Object.assign(rowdata, {"name":dbRecord.name})

        //Extract label and values from the Attributes
        dbRecord.attributes.forEach(dbRecordCol => {
          const colVal = dbRecordCol.value ? dbRecordCol.value : ''
          const colLabel = dbRecordCol.label
          rowdata = Object.assign(rowdata, {[colLabel]: colVal})
        })
        rowdata = Object.assign(rowdata, {
          actions: `<a  class="bi-pencil-fill" data-toggle="tooltip" data-placement="bottom" title="Edit Form" href="${frontendUrl}/EditForm/${this.route.snapshot.params.name}/${dbRecord.id}"></a>`
        })
        //push a record
        rowDataList.push(rowdata)
      })

      //Extract column names
      this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
      if (this.displayedColumns.length > columnLength) {
        this.showHideColumn = true
        this.initializeColumnProperties()
      }
      this.dataSource.data = rowDataList
    }
  }

  initializeColumnProperties(): void {
    this.displayedColumns.forEach((element, index) => {
      if (this.columnShowHideList.length === this.displayedColumns.length - 1) {
      } else if (element === 'actions') {
      } else {
        this.columnShowHideList.push({
          possition: index,
          name: element,
          isActive: true
        })
      }
    })
  }

  toggleColumn(column): void {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name)
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name)
      }
    } else {
      const i = this.displayedColumns.indexOf(column.name)
      const opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined
    }
  }

  saveUserSelected(): void {
    ;(this.userPreference.selectedColumns = this.displayedColumns.toString()),
      (this.userPreference.templateId = this.tempid),
      (this.userPreference.userFk = this.UserObj.id),
      (this.userPreference.id = this.userPreference.id)
    if (this.userPreference.id) {
      this.updateSelectedColumns(this.userPreference.id)
      this.refresh()
    } else {
      this.userPreferenceService
        .createUserPreference(this.userPreference)
        .subscribe(
          () => {
            this.alertService.success(
              'Selected Columns Saved Sucessfully',
              this.options
            )
            this.refresh()
          },
          error => {
            console.log(error)
          }
        )
    }
  }
  refresh(): void {
    window.location.reload()
  }

  retrieveSelectedColumns(tempid, userFk): void {
    this.userPreferenceService
      .getAllSelectedColumns(this.tempid, userFk)
      .subscribe(data => {
        if (data.length > 0) {
          this.userPreference = data[0]
          this.userSelectedColumns = data[0].selectedColumns.split(',')
          this.displayedColumns = this.userSelectedColumns
          this.columnShowHideList.forEach(element => {
            if (!this.displayedColumns.includes(element.name)) {
              element.isActive = false
            }
          })
        }
      })
  }

  toggleColumns(column): void {
    if (column.isActive) {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name)
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name)
      }
    } else {
      const i = this.displayedColumns.indexOf(column.name)
      const opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined
    }
  }

  updateSelectedColumns(id: number): void {
    this.userPreferenceService
      .updateSelectedColumns(id, this.userPreference)
      .subscribe(
        data => {
          this.userPreference = data
        },
        error => {
          console.log(error)
        }
      )
  }
}
