/* eslint-disable filenames/match-regex */
import {FileTray} from 'src/app/models/trayFile.model'
import {ActivatedRoute} from '@angular/router'
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import {MatSelectChange} from '@angular/material/select'
import {Observable, Subscription, fromEvent, interval, merge} from 'rxjs'
import {debounceTime, filter} from 'rxjs/operators'
import {
  KtdDragEnd,
  KtdDragStart,
  KtdGridComponent,
  KtdGridLayout,
  KtdGridLayoutItem,
  KtdResizeStart,
  ktdTrackById
} from '@katoid/angular-grid-layout'
import {ktdArrayRemoveItem} from './tray.utils'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {RackService} from '../../services/rack.service'
import {AlertService} from '../_alert/alert.service'
import {UploadFilesService} from 'src/app/services/upload-files.service'
import {HttpEventType, HttpResponse} from '@angular/common/http'
import {MatTableDataSource} from '@angular/material/table'
import {Tray} from 'src/app/models/tray.model'
import {User} from 'src/app/models/user.model'
import {environment} from 'src/environments/environment'
const serverBaseURL = environment.baseUrl
@Component({
  selector: 'ktd-playground',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit, OnDestroy {
  trayObject: Tray = {
    id: 0,
    trayLayoutId: '',
    x: 0,
    y: 0,
    h: 0,
    w: 0,
    color: '',
    quantity: 0,
    rack_fk: 0,
    name: '',
    searchable: false,
    img: '',
    cssClass: ''
  }
  displayedColumns: string[] = ['name', 'storeName']
  dataSource = new MatTableDataSource<any>()
  UserObj: User = {}
  trayId: number
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  selectedFiles?: FileList
  currentFile?: File
  progress = 0
  message = ''
  fileInfos?: Observable<any>

  file: FileTray = {
    filename: '',
    filepath: `${serverBaseURL}/files/`,
    tray_fk: 0,
    user_fk: 0
  }

  constructor(
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private rackService: RackService,
    private alertService: AlertService,
    private uploadService: UploadFilesService
  ) {}

  @ViewChild(KtdGridComponent, {static: true}) grid: KtdGridComponent
  trackById = ktdTrackById

  cols = 12
  rowHeight = 50
  compactType: 'vertical' | 'horizontal' | null
  trayList: KtdGridLayout = []
  trayDataList = []
  trayDataListFetched = []
  fileList = []

  transitions: {name: string; value: string}[] = [
    {
      name: 'ease',
      value: 'transform 500ms ease, width 500ms ease, height 500ms ease'
    },
    {
      name: 'ease-out',
      value:
        'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out'
    },
    {
      name: 'linear',
      value: 'transform 500ms linear, width 500ms linear, height 500ms linear'
    },
    {
      name: 'overflowing',
      value:
        'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
    },
    {
      name: 'fast',
      value: 'transform 200ms ease, width 200ms linear, height 200ms linear'
    },
    {
      name: 'slow-motion',
      value:
        'transform 1000ms linear, width 1000ms linear, height 1000ms linear'
    },
    {name: 'transform-only', value: 'transform 500ms ease'}
  ]
  currentTransition: string = this.transitions[0].value

  dragStartThreshold = 0
  disableDrag = false
  disableResize = false
  disableRemove = false
  autoResize = false
  isDragging = false
  isResizing = false
  resizeSubscription: Subscription
  currentlyBeingEditedTray = null
  traySelected = false
  fileId = undefined
  rackId: number
  rackName: string
  search = ''
  isQuantity = false
  addItems = false
  currentlyTraySearchable = false

  form = new FormGroup({
    trayname: new FormControl('', Validators.required)
  })

  isColorOpen = false

  openFileUpload: false

  ngOnInit() {
    this.rackId = this.route.snapshot.params.id
    this.getTrayProp(this.route.snapshot.params.id)
    this.getTrayDataById(this.route.snapshot.params.id)

    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.file.user_fk = this.UserObj.clientFk
    this.rackName = this.route.snapshot.params.name
    this.resizeSubscription = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange')
    )
      .pipe(
        debounceTime(50),
        filter(() => this.autoResize)
      )
      .subscribe(() => {
        this.grid.resize()
      })
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe()
  }
  onDragEnd(event: KtdDragEnd): void {
    this.isDragging = true
  }
  onDragStarted(event: KtdDragStart): void {
    this.isDragging = true
  }

  onResizeStarted(event: KtdResizeStart): void {
    this.isResizing = true
  }

  onDragEnded(): void {
    this.isDragging = false
  }

  onResizeEnded(): void {
    this.isResizing = false
  }

  onLayoutUpdated(layout: KtdGridLayout): void {
    this.trayList = layout
  }

  onCompactTypeChange(change: MatSelectChange): void {
    this.compactType = change.value
  }

  onTransitionChange(change: MatSelectChange): void {
    this.currentTransition = change.value
  }

  onDisableDragChange(checked: boolean): void {
    this.disableDrag = checked
  }

  onDisableResizeChange(checked: boolean): void {
    this.disableResize = checked
  }

  onDisableRemoveChange(checked: boolean): void {
    this.disableRemove = checked
  }

  onAutoResizeChange(checked: boolean): void {
    this.autoResize = checked
  }

  onColsChange(event: Event): void {
    this.cols = parseInt((event.target as HTMLInputElement).value, 10)
  }

  onRowHeightChange(event: Event): void {
    this.rowHeight = parseInt((event.target as HTMLInputElement).value, 10)
  }

  onDragStartThresholdChange(event: Event): void {
    this.dragStartThreshold = parseInt(
      (event.target as HTMLInputElement).value,
      10
    )
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files
    this.upload()
  }

  upload(): void {
    this.progress = 0

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0)

      if (file) {
        this.currentFile = file

        this.uploadService.upload(file).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total)
              this.file.filepath = this.file.filepath + this.currentFile.name
              this.currentlyBeingEditedTray.img = this.file.filepath
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message
              this.fileInfos = this.uploadService.getFiles()
            }
          },
          (err: any) => {
            console.log(err)
            this.progress = 0

            if (err.error && err.error.message) {
              this.message = err.error.message
            } else {
              this.message = 'Could not upload the file!'
            }

            this.currentFile = undefined
          }
        )
      }
      this.selectedFiles = undefined
    }
  }

  /** Adds a grid item to the layout */
  copyTray(): void {
    const maxId = this.trayList.reduce(
      (acc, cur) => Math.max(acc, parseInt(cur.id, 10)),
      -1
    )
    const nextId = maxId + 1
    const newLayoutItem: KtdGridLayoutItem = {
      id: nextId.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 2
    }

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.trayList = [newLayoutItem, ...this.trayList]

    this.rackService.fetchTrayById(this.currentlyBeingEditedTray.id).subscribe(
      response => {
        this.trayObject = response
        this.trayObject.id = null
        this.trayObject.name = this.form.controls.trayname.value
        this.rackService.createTray(this.trayObject).subscribe(
          () => {
            this.getTrayDataById(this.route.snapshot.params.id)
            this.getTrayProp(this.route.snapshot.params.id)
          },
          error => {
            console.log(error)
          }
        )
      },
      error => {
        console.log(error)
      }
    )
  }

  /**
   * Fired when a mousedown happens on the remove grid item button.
   * Stops the event from propagating an causing the drag to start.
   * We don't want to drag when mousedown is fired on remove icon button.
   */
  stopEventPropagation(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
  }

  /** Removes the item from the layout */
  removeTray(): void {
    this.rackService.deleteTrayById(this.currentlyBeingEditedTray.id).subscribe(
      response => {
        this.trayObject = response
        this.alertService.success(response.message, this.options)

        this.getTrayDataById(this.route.snapshot.params.id)
      },
      error => {
        console.log(error)
      }
    )
    // TODO: based on the ID execute database call and then in the success response execute the code below.
    this.trayList = ktdArrayRemoveItem(
      this.trayList,
      item => item.id === this.currentlyBeingEditedTray.id
    )
  }
  editTray(id: string): void {
    this.traySelected = true
    const index = this.trayList.findIndex(item => item.id === id)
    if (index > -1) {
      this.currentlyBeingEditedTray = this.trayDataList[index]
      this.form.setValue({trayname: this.currentlyBeingEditedTray.name})
      this.trayId = this.currentlyBeingEditedTray.id
      this.currentlyTraySearchable = this.currentlyBeingEditedTray.searchable
      this.currentlyBeingEditedTray.cssClass = 'traySelected'
    }
  }

  updateSearchValue(): void {
    this.currentlyBeingEditedTray.searchable = !this.currentlyBeingEditedTray
      .searchable
    this.currentlyTraySearchable = this.currentlyBeingEditedTray.searchable
  }

  saveTray(): void {
    this.currentlyBeingEditedTray.name = this.form.controls.trayname.value

    if (this.currentlyBeingEditedTray.img === undefined) {
      this.file.filepath = ''
      this.currentlyBeingEditedTray.img = this.file.filepath
    }

    this.rackService
      .updateTray(
        this.currentlyBeingEditedTray.id,
        this.currentlyBeingEditedTray
      )
      .subscribe(
        response => {
          this.trayObject = response
          this.alertService.success('Tray Is Saved Successfully', this.options)

          this.getTrayDataById(this.route.snapshot.params.id)
        },
        error => {
          console.log(error)
        }
      )
  }

  changeColorComplete(event): void {
    this.currentlyBeingEditedTray.color = event.color.hex
  }

  getTrayProp(rack_fk: number): void {
    this.rackService.getTrayPropById(rack_fk).subscribe(
      data => {
        this.trayList = data
      },
      error => {
        console.log(error)
      }
    )
  }

  fetchTrayList(trayId: number): void {
    this.rackService.getTrayPropById(trayId).subscribe(
      data => {
        this.trayList = data
      },
      error => {
        console.log(error)
      }
    )
  }

  saveTrayLayout(trayList: Tray[]): void {
    this.rackService.saveTrayLayout(trayList, this.trayId).subscribe(
      () => {
        this.alertService.success(
          'Tray Layout Updated Successfully',
          this.options
        )
        this.getTrayDataById(this.rackId)
      },
      error => {
        console.log(error)
      }
    )
  }

  getTrayDataById(rack_fk: number): void {
    this.rackService.getTrayDataById(rack_fk).subscribe(
      data => {
        this.trayDataList = data
        this.trayDataList = this.trayDataList.map(newValue => ({
          ...newValue,
          cssClass: ''
        }))
        console.log(`trayDataList${this.trayDataList}`)
      },
      error => {
        console.log(error)
      }
    )
  }
}
