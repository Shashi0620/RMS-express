import {Component, OnInit, ViewChild} from '@angular/core'
import {UserService} from '../services/user.service'
import {MatTableDataSource} from '@angular/material/table'
import swal from 'sweetalert2'
import {ActivatedRoute, Router} from '@angular/router'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../components/_alert'
import {User} from '../models/user.model'
import {Plan} from '../models/plan.model'
@Component({
  selector: 'app-staff-crud',
  templateUrl: './staff-crud.component.html',
  styleUrls: ['./staff-crud.component.css']
})
export class StaffCrudComponent implements OnInit {
  UserObj: User = {}
  PlanObj: any = {}
  displayedColumns: string[] = ['name', 'email', 'actions']
  dataSource = new MatTableDataSource<any>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}
  roleId: 0
  RoleObj: any = {}
  RoleName = ''
  noOfstaff: User[]
  noOfUsers: ''
  planName: ''
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
  value: String
  ngOnInit(): void {
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.RoleName = this.RoleObj[0].name
    this.planName = this.PlanObj[0].name
    if (this.PlanObj.length) {
      this.noOfUsers = this.PlanObj[0].noOfUsers
    }
    this.getStaffByRole()
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))

    this.value = localStorage.getItem('Staff')
  }

  getClientStaffList(): void {
    this.userService
      .getClientStaffList(this.UserObj.clientFk, this.roleId)
      .subscribe(
        data => {
          this.noOfstaff = data
          this.dataSource.data = data
        },
        error => {
          console.log(error)
        }
      )
  }

  getStaffByRole(): void {
    this.userService.getStaffRole().subscribe(
      data => {
        this.roleId = data[0].id
        this.getClientStaffList()
      },
      error => {
        console.log(error)
      }
    )
  }

  deleteStaff(id): void {
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
        this.deleteStaffById(id)
      }
    })
  }

  deleteStaffById(id): void {
    this.userService.delete(id).subscribe(
      () => {
        this.alertService.success('Staff Deleted Successfully', this.options)
        this.userService.getClientStaffList(this.UserObj.clientFk, this.roleId)
        this.getClientStaffList()
      },
      error => {
        this.alertService.error(error.error.message, this.options)
        console.log(error)
      }
    )
  }
}
