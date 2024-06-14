import {Component, Input, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {AlertService} from '../components/_alert'
import {FormService} from '../services/app.form.service'
import {RackService} from '../services/rack.service'
import * as $ from 'jquery'
import {UserService} from '../services/user.service'
import {MatPaginator} from '@angular/material/paginator'
import {NotificationService} from '../notification.service'
import {Template} from '@angular/compiler/src/render3/r3_ast'
import {User} from '../models/user.model'
import {Notification} from '../models/notification.model'
import {NotificationSetting} from '../models/notificationSetting.model'

@Component({
  selector: 'app-formlist-quantity',
  templateUrl: './formlist-quantity.component.html',
  styleUrls: ['./formlist-quantity.component.css']
})
export class FormlistQuantityComponent implements OnInit {
  trayItems = {
    quantity: 0,
    trayId: 0,
    formId: 0,
    rackId: 0,
    userFk: 0,
    tempId: 0,
    upperLimit: 0,
    lowerLimit: 0,
    notificationSettngFk: 0
  }

  @Input()
  name: string

  @Input()
  id: number

  @Input()
  isQuantity: boolean

  @Input()
  trayId: number

  @Input()
  rackId: number

  @Input()
  rackName: string

  rowDataList: any = []

  dataList: any = {}

  filteredTemplates: Template[]

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  visible: boolean = false
  isShownNextButton: boolean
  elasticSearch = {
    name: '',
    rackId: 0,
    username: '',
    attributes: [{}]
  }

  notification = {
    id: 0,
    settingName: '',
    location: ''
  }

  dataSource = new MatTableDataSource<any>()

  quantity: string
  upperLimit: number
  lowerLimit: number
  notificationSettngFk: number

  displayedColumns: string[] = []

  UserObj: User = {}

  text: any
  notificationList: Notification[]
  notificationSetting: NotificationSetting = {
    settingName: '',
    notificationType: '',
    isEscalationRequired: false,
    storeFk: 0
  }

  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private formService: FormService,
    private rackService: RackService,
    private alertService: AlertService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.elasticSearch.username = this.UserObj.username
    this.trayItems.userFk = this.UserObj.id
    this.retrieveForms()
    this.fetchAllNotifications()
  }

  fetchAllNotifications(): void {
    this.notificationService.fetchALLNotification().subscribe(response => {
      this.notificationList = response
    })
  }

  onLowerLimit(lowerLimit): void {
    this.lowerLimit = lowerLimit.target.value
  }

  onUpperLimit(upperLimit): void {
    this.upperLimit = upperLimit.target.value
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  retrieveForms(): void {
    this.formService
      .getAllProductsByItemTempId(this.id, this.name)
      .subscribe(data => {
        this.extractData(data)
      })
  }

  onKeyUp(x): void {
    // appending the updated value to the variable
    this.text = x.target.value
  }

  fetchAllProducts(): void {
    this.formService
      .getAllProductsByItemTempId(this.id, this.name)
      .subscribe(data => {
        this.editFormList(data)
      })
  }

  addItemsToTray(formId): void {
    this.trayItems.quantity = parseInt(this.text)
    this.trayItems.lowerLimit = this.lowerLimit
    this.trayItems.upperLimit = this.upperLimit
    this.trayItems.formId = formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.id
    this.trayItems.notificationSettngFk = this.notification.id
    this.rackService
      .fetchTrayTemplateAndFormById(
        this.trayItems.trayId,
        this.trayItems.tempId,
        this.trayItems.formId
      )
      .subscribe(response => {
        if (response.length > 0) {
          this.text = $('#updateQuantity').val()
          this.trayItems.quantity = parseInt(this.text)
          this.rackService
            .updateTrayItem(response[0].id, this.trayItems)
            .subscribe(
              () => {
                this.alertService.success(
                  'Items Updated Successfully To Tray',
                  this.options
                )
              },
              error => {
                this.alertService.error(error.error.message, this.options)
                console.log(error)
              }
            )
        } else {
          this.rackService.createTrayItems(this.trayItems).subscribe(
            response => {
              this.alertService.success(
                'Items Added Successfully To Tray',
                this.options
              )
              this.elasticSearch.name = this.rackName
              this.elasticSearch.rackId = this.trayItems.rackId
              this.filteredTemplates = response.filter(
                templateForms => templateForms.id === formId
              )
              this.elasticSearch.attributes = this.filteredTemplates[0].attributes
              this.userService
                .updateUserElasticSearchUrl(this.UserObj.id, this.elasticSearch)
                .subscribe(() => {})
            },
            error => {
              this.alertService.error(error.error.message, this.options)
              console.log(error)
            }
          )
        }
      })
  }

  editForm(): void {
    this.formService
      .getAllProductsByItemTempId(this.id, this.name)
      .subscribe(data => {
        this.formListing(data)
      })
  }

  formListing(serverData): void {
    const rowDataList: any = []
    serverData.forEach(dbRecord => {
      let rowdata
      // Prepare Row Data
      rowdata = Object.assign({id: dbRecord.id})

      // Extract label and values from the Attributes
      dbRecord.attributes.forEach(dbRecordCol => {
        const colVal = dbRecordCol.value ? dbRecordCol.value : ''
        const colLabel = dbRecordCol.label
        rowdata = Object.assign(rowdata, {[colLabel]: colVal})
      })

      rowdata = Object.assign(rowdata, {quantity: this.quantity})

      rowdata = Object.assign(rowdata, {actions: ``})
      //push a record
      rowDataList.push(rowdata)
    })

    //Extract column names
    this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
    this.dataSource.data = rowDataList
  }

  private extractData(serverData): void {
    serverData.forEach(dbRecord => {
      let rowdata
      // Prepare Row Data

      // rowdata = Object.assign(rowdata, {"name":dbRecord.name})
      if (this.trayId !== undefined) {
        this.rackService
          .fetchTemplateAndTrayById(this.id, this.trayId)
          .subscribe(response => {
            if (response.length > 0) {
              rowdata = Object.assign({id: dbRecord.id})
              for (let i = 0; i < response.length; i++) {
                if (dbRecord.id === response[i].formId) {
                  this.quantity = response[i].quantity
                  this.upperLimit = response[i].upperLimit
                  this.lowerLimit = response[i].lowerLimit
                  this.notificationSettngFk = response[i].notificationSettngFk
                  this.notificationService
                    .fetchNotificationSettingById(this.notificationSettngFk)
                    .subscribe(response => {
                      this.notificationSetting = response
                    })
                  if (this.isQuantity) {
                    dbRecord.attributes.forEach(dbRecordCol => {
                      const colVal = dbRecordCol.value ? dbRecordCol.value : ''
                      const colLabel = dbRecordCol.label
                      rowdata = Object.assign(rowdata, {[colLabel]: colVal})
                    })

                    rowdata = Object.assign(rowdata, {
                      quantity: this.quantity
                    })

                    rowdata = Object.assign(rowdata, {actions: ``})
                    // push a record
                  }
                  this.rowDataList.push(rowdata)
                  // Extract column names
                  this.displayedColumns = Object.getOwnPropertyNames(
                    this.rowDataList[0]
                  )
                  this.dataSource.data = this.rowDataList
                }
              }
            } else {
              this.formListing(serverData)
            }
          })
      } else {
        this.formListing(serverData)
      }
    })
  }

  editFormList(serverData): void {
    const rowDataList: any = []
    serverData.forEach(dbRecord => {
      let rowdata
      // Prepare Row Data
      rowdata = Object.assign({id: dbRecord.id})

      // Extract label and values from the Attributes
      dbRecord.attributes.forEach(dbRecordCol => {
        const colVal = dbRecordCol.value ? dbRecordCol.value : ''
        const colLabel = dbRecordCol.label
        rowdata = Object.assign(rowdata, {[colLabel]: colVal})
      })

      rowdata = Object.assign(rowdata, {quantity: ``})
      rowdata = Object.assign(rowdata, {actions: ``})
      // push a record
      rowDataList.push(rowdata)
    })
    //Extract column names
    this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
    this.rackService
      .fetchTemplateAndTrayById(this.id, this.trayId)
      .subscribe(response => {
        this.dataSource.data = this.filterObjects(rowDataList, response)
        this.dataSource.data = this.dataSource.data.sort((a, b) => b.id - a.id)
      })
  }

  filterObjects = (arr1, arr2) => {
    let res = []
    res = arr1.filter(formList => {
      return !arr2.find(retrievedFromDb => {
        return retrievedFromDb.formId === formList.id
      })
    })
    return res
  }

  save(formId): void {
    this.trayItems.quantity = parseInt(this.text)
    this.trayItems.formId = formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.id
    this.rackService
      .createTrayItems(this.trayItems)
      .subscribe(() => this.alertService.success('Tray Saved Successfully'))
  }
  editTrayItem(formId): void {
    this.trayItems.quantity = parseInt(this.text)
    this.trayItems.formId = formId
    this.trayItems.trayId = this.trayId
    this.trayItems.rackId = this.rackId
    this.trayItems.tempId = this.id
    this.rackService
      .updateTrayItem(this.trayId, this.trayItems)
      .subscribe(() => this.alertService.success('Tray Updated Successfully'))
  }

  retriveItems() {
    this.isShownNextButton = !this.isShownNextButton
    if (this.isShownNextButton === false) {
      this.dataSource.data = this.rowDataList
    } else {
      this.fetchAllProducts()
    }
  }

  deleteTraysItem(formId) {
    this.trayItems.rackId = this.rackId
    this.rackService
      .deleteTrayItem(this.rackId)
      .subscribe(responce => console.log('Successfully deleted'))
  }
}
