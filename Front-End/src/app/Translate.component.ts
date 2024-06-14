import {Component, OnInit, ViewChild} from '@angular/core'
import {MatTable, MatTableDataSource} from '@angular/material/table'
import {User} from './models/user.model'
import {AlertService} from '../app/components/_alert/alert.service'
import {UserService} from './services/user.service'
import {AddMenuComponent} from '../app/dialog/add-translate.component'
import {MatDialog} from '@angular/material/dialog'
import swal from 'sweetalert2'
import {MatPaginator} from '@angular/material/paginator'
export interface PeriodicElement {
  Key: string
  Value: string
}

@Component({
  selector: 'app-root',
  templateUrl: '/Translate-listing.html'
})
export class TranslateComponent implements OnInit {
  displayedColumns: string[] = ['Key', 'Value', 'Actions']
  dataSource = new MatTableDataSource<PeriodicElement>()

  //@ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatTable) table: MatTable<any>
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  objectKeys: any
  constructor(
    private userService: UserService,
    public dialog: MatDialog,

    private alertService: AlertService
  ) {}
  UserObj: User = {}
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator}
  }
  ngOnInit() {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.getAllMenuData(this.UserObj.username)
  }
  getAllMenuData(username): void {
    this.userService.getAllMenuData(username).subscribe(response => {
      this.dataSource.data = response
      // this.dataSource.data.map(datavalues =>
      //   localStorage.setItem(datavalues.Key, datavalues.Value)
      // )
    })
  }
  openDialog(action, obj) {
    if (action === 'Delete') {
      this.removeForm(obj)
    } else {
      obj.action = action
      const dialogRef = this.dialog.open(AddMenuComponent, {
        width: '500px',
        height: '50%',
        data: obj
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Add') {
          this.addRowData(result.data)
        } else if (result.event == 'Update') {
          this.updateRowData(result.data, obj)
        } else if (result.event == 'Delete') {
          this.removeForm(result.data)
        }
      })
    }
  }
  addRowData(row_obj) {
    this.dataSource.data.push({
      Key: row_obj.Key,
      Value: row_obj.Value
    })

    // this.save(this.dataSource.data, this.UserObj.username)
    //this.refresh()
    this.table.renderRows()
  }
  updateRowData(row_obj, obj) {
    const index = this.dataSource.data.findIndex(value => value.Key == obj.Key)
    delete row_obj.action
    this.dataSource.data[index] = row_obj
    localStorage.removeItem(obj.Key)
    this.table.renderRows()
  }
  removeForm(row_obj): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this form?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => this.deleteRowData(row_obj))
  }

  deleteRowData(row_obj) {
    const deletedRowIndex = this.dataSource.data.findIndex(
      value => value.Key == row_obj.Key
    )
    if (deletedRowIndex > 0) {
      this.dataSource.data.splice(deletedRowIndex, 1)
    } else {
      return 'Error in deleting Row Record'
    }
    localStorage.removeItem(row_obj.Key)

    this.table.renderRows()
  }

  save(): void {
    this.userService
      .saveData(this.dataSource.data, this.UserObj.username)
      .subscribe(
        response => {
          this.getAllMenuData(this.UserObj.username)
        },
        error => {
          console.log(error)
        }
      )
  }
  refresh(): void {
    window.location.reload()
  }
}
