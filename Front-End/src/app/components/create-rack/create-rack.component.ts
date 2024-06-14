/* eslint-disable filenames/match-regex */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {Router} from '@angular/router'
import {Component, OnInit} from '@angular/core'
import {Rack} from '../../models/rack.model'
import {RackService} from '../../services/rack.service'
import {StoreService} from '../../store.service'
import {Store} from '../../models/store.model'
import {environment} from '../../../environments/environment'
import {User} from '../../models/user.model'
import {Plan} from '../../models/plan.model'
const selectedPlan = environment.selectedPlan
@Component({
  selector: 'app-create-rack',
  templateUrl: './create-rack.component.html',
  styleUrls: ['./create-rack.component.css']
})
export class CreateRackComponent implements OnInit {
  UserObj: User = {}
  PlanObj: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }

  rack: Rack = {
    name: '',
    no_of_rows: 0,
    no_of_columns: 0,
    client_fk: 0,
    createdon: '',
    storeFk: 0
  }
  store: Store = {
    storeId: 0,
    storeName: '',
    location: ''
  }
  storeList: Store[]

  constructor(
    private router: Router,
    private rackService: RackService,
    private formBuilder: FormBuilder,
    private storeService: StoreService
  ) {}
  loading = false
  submitted = false
  rackForm: FormGroup
  rackObj: Rack
  createdon: string
  isStorePresent = true
  ngOnInit(): void {
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.rack.client_fk = this.UserObj.clientFk
    this.rackForm = this.formBuilder.group({
      name: ['', Validators.required],
      no_of_rows: ['', [Validators.required]],
      no_of_columns: ['', [Validators.required]],
      client_fk: this.UserObj.clientFk,
      store: ['', Validators.required],
      storeFk: ''
    })

    if (this.PlanObj[0].name === selectedPlan) {
      this.isStorePresent = false
      this.rackForm.value.store = null
    }
    this.getStores(this.UserObj.clientFk)
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

  get f(): {[key: string]: AbstractControl} {
    return this.rackForm.controls
  }

  async saveRack(): Promise<Rack> {
    this.rackForm.value.storeFk = this.rackForm.value.store
    this.submitted = true
    if (this.rackForm.invalid) {
      return
    }
    try {
      this.rack = await this.rackService
        .createRack(this.rackForm.value)
        .toPromise()
      this.router.navigate(['/racks'])
      return this.rack
    } catch (error) {
      this.handleError(error.message)
    }
  }
  handleError(err: ErrorEvent): void {
    alert(err)
  }
  fetchAllRacks(): void {
    this.router.navigate(['/racks'])
  }
}
