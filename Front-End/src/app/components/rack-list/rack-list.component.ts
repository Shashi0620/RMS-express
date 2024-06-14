/* eslint-disable filenames/match-regex */
import {ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit, ViewChild} from '@angular/core'
import {RackService} from '../../services/rack.service'
import {DatePipe} from '@angular/common'
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator'
import {AlertService} from '../_alert/alert.service'
import swal from 'sweetalert2'
import {Rack} from '../../models/rack.model'
import {User} from '../../models/user.model'
import {Plan} from '../../models/plan.model'

@Component({
  selector: 'app-rack-list',
  templateUrl: './rack-list.component.html',
  styleUrls: ['./rack-list.component.css']
})
export class RackListComponent implements OnInit {
  rackObject: Rack
  client_fk: number
  rackArray?: Rack[]
  displayedColumns: string[] = [
    'name',
    'no_of_rows',
    'no_of_columns',
    'createdAt',
    'actions'
  ]
  dataSource = new MatTableDataSource<Rack>()
  rackObj: Rack = {
    name: '',
    createdon: '',
    client_fk: 0
  }
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  @ViewChild(MatPaginator) paginator: MatPaginator
  search = ''
  datePicker = ''
  UserObj: User = {}
  RoleObj: any = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  RoleName = ''
  noOfRackscreated: Rack[]
  noOfRacks: number
  isRackCreated = false

  constructor(
    private rackService: RackService,
    public datepipe: DatePipe,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {}
  value: string
  ngOnInit(): void {
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.RoleName = this.RoleObj[0].name
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.noOfRacks = this.PlanObj[0].noOfRacks
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.rackListing(this.UserObj.clientFk)
    this.rackObj.client_fk = this.route.snapshot.params.id
    this.value = localStorage.getItem('Racks')
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  fetchRackById(id: number): void {
    this.rackService.getRackById(id).subscribe(
      response => {
        this.rackObject = response
        this.router.navigate(['/editRack', this.rackObject.id])
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  fetchTrayView(id: number, name: string): void {
    this.router.navigate(['/racklayout', id, name])
  }

  deleteRack(id): void {
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
        this.deleteRackById(id)
      }
    })
  }

  deleteRackById(id: number): void {
    this.rackService.deleteRackById(id).subscribe(
      response => {
        this.rackObject = response
        this.alertService.success('Rack Deleted Successfully', this.options)
        this.rackListing(this.UserObj.clientFk)
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  rackListing(client_fk: number): void {
    this.rackService.fetchAllRacks(client_fk).subscribe((data: Rack[]) => {
      this.noOfRackscreated = data
      this.dataSource.data = data
      if (
        this.noOfRackscreated.length <= this.noOfRacks &&
        this.RoleName === 'Admin'
      ) {
        this.isRackCreated = true
      }
      error => {
        this.handleError(error.message)
      }
    })
  }
  cancel(): void {
    this.router.navigate(['/createRack'])
  }
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue
  }
}
