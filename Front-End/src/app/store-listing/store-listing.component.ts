import {Component, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {StoreService} from '../store.service'
import swal from 'sweetalert2'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../components/_alert'
import {Router} from '@angular/router'
import {User} from '../models/user.model'
import {Store} from '../models/store.model'

@Component({
  selector: 'app-store-listing',
  templateUrl: './store-listing.component.html',
  styleUrls: ['./store-listing.component.css']
})
export class StoreListingComponent implements OnInit {
  UserObj: User = {}
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  Value = localStorage.getItem('Stores')
  displayedColumns: string[] = ['storeName', 'address', 'actions']
  dataSource = new MatTableDataSource<Store[]>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private storeService: StoreService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.getStores(this.UserObj.clientFk)
  }

  getStores(client_fk: number): void {
    this.storeService.fetchAllStoresByClientFK(client_fk).subscribe(
      (data: any) => {
        this.dataSource.data = data
      },
      error => {
        console.log(error)
      }
    )
  }

  deleteStore(id: number): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteStoreById(id)
      }
    })
  }
  deleteStoreById(id): void {
    this.storeService.deleteStoreById(id).subscribe(
      response => {
        this.alertService.success(response.message, this.options)
        this.getStores(this.UserObj.clientFk)
      },
      error => {
        this.alertService.error(error.error.message, this.options)
        console.log(error)
      }
    )
  }

  fetchNotificationsBelongsToStore(storeId): void {
    this.router.navigate(['/fetchNotification', storeId])
  }
}
