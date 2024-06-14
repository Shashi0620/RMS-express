/* eslint-disable filenames/match-regex */
import {Rack} from './../../models/rack.model'
import {ActivatedRoute, Router} from '@angular/router'
import {Component, OnInit} from '@angular/core'
import {RackService} from '../../services/rack.service'
import {AlertService} from '../_alert/alert.service'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {StoreService} from '../../store.service'
import {Store} from '../../models/store.model'
import {environment} from '../../../environments/environment'
import {User} from '../../models/user.model'
import {Plan} from '../../models/plan.model'
const selectedPlan = environment.selectedPlan

@Component({
  selector: 'app-edit-rack',
  templateUrl: './edit-rack.component.html',
  styleUrls: ['./edit-rack.component.css']
})
export class EditRackComponent implements OnInit {
  rackId: number
  client_fk: number
  rackObject: Rack = {
    name: '',
    no_of_rows: 0,
    no_of_columns: 0
  }

  store: Store = {
    storeId: 0,
    storeName: '',
    location: ''
  }

  isStorePresent = true
  storeObj = {storeName: '', location: '', client_fk: 0}
  storeList: Store[]
  submitted = false
  UserObj: User = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  rackForm: FormGroup

  ngOnInit(): void {
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.client_fk = this.UserObj.clientFk
    this.rackId = this.route.snapshot.params['id']

    if (this.PlanObj[0].name === selectedPlan) {
      this.isStorePresent = false
      this.rackForm.value.storeFk = null
    }
    this.getStores(this.UserObj.clientFk)
    this.getRackById(this.rackId)
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rackService: RackService,
    private storeService: StoreService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.rackForm = this.formBuilder.group({
      name: ['', Validators.required],
      no_of_rows: ['', Validators.required],
      no_of_columns: ['', Validators.required],
      storeFk: ''
    })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.rackForm.controls
  }

  getStores(client_fk: number): void {
    this.storeService.fetchAllStoresByClientFK(client_fk).subscribe(
      (data: Store[]) => {
        this.storeList = data
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  getRackById(id: number): void {
    this.rackService.getRackById(id).subscribe(
      data => {
        this.rackObject = data
        this.storeService.getStoreById(data.storeFk).subscribe(response => {
          this.store = response
        })
      },
      error => this.handleError(error.message)
    )
  }

  onSubmit(): void {
    this.rackForm.value.storeFk = this.store.storeId
    this.submitted = true
    if (this.rackForm.invalid) {
      return
    }
    this.updateRack()
  }

  updateRack(): void {
    this.rackService.updateRack(this.rackId, this.rackObject).subscribe(
      data => {
        this.rackObject = data
        this.router.navigate(['/racks'])
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  fetchAllRacks(): void {
    this.router.navigate(['/racks'])
  }
}
