import {Component, OnInit, ViewChild} from '@angular/core'
import {MatPaginator} from '@angular/material/paginator'
import {MatTableDataSource} from '@angular/material/table'
import {ActivatedRoute, Route, Router} from '@angular/router'
import {NotificationService} from '../notification.service'
import swal from 'sweetalert2'
import {AlertService} from '../components/_alert'
import {Notification} from '../models/notification.model'

@Component({
  selector: 'app-notification-listing',
  templateUrl: './notification-listing.component.html',
  styleUrls: ['./notification-listing.component.css']
})
export class NotificationListingComponent implements OnInit {
  displayedColumns: string[] = ['settingName', 'notificationType', 'actions']
  dataSource = new MatTableDataSource<Notification>()
  storeId: number

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.snapshot.params['storeId']
    console.log(this.storeId)
    this.fetchNotificationByStoreFk(this.storeId)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  fetchNotificationByStoreFk(storeFk): void {
    this.notificationService
      .fetchNotificationByStoreFk(storeFk)
      .subscribe(response => {
        this.dataSource.data = response
      })
  }

  deleteNotification(id): void {
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
        this.deleteNotificationById(id)
      }
    })
  }

  deleteNotificationById(id): void {
    this.notificationService
      .deleteNotificationSetting(id)
      .subscribe(response => {
        this.alertService.success(response.message, this.options)
        this.fetchNotificationByStoreFk(this.storeId)
      })
  }

  addNewNotification(): void {
    this.router.navigate(['/addNotification', this.storeId])
  }
}
