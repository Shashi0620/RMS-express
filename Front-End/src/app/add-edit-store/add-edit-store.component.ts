/* eslint-disable filenames/match-regex */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {Store} from '../models/store.model'
import {User} from '../models/user.model'
import {StoreService} from '../store.service'

@Component({
  selector: 'app-add-edit-store',
  templateUrl: './add-edit-store.component.html',
  styleUrls: ['./add-edit-store.component.css']
})
export class AddEditStoreComponent implements OnInit {
  store: Store = {
    storeId: 0,
    storeName: '',
    location: ''
  }
  stores
  UserObj: User = {}
  storeObj: Store = {
    storeName: '',
    location: '',
    client_fk: 0
  }

  constructor(
    private router: Router,
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  loading = false
  submitted = false
  storeForm: FormGroup

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.storeForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      address: ['', Validators.required],
      client_fk: this.UserObj.clientFk
    })
    this.getStoreById = this.route.snapshot.params.storeId
  }

  get f(): {[key: string]: AbstractControl} {
    return this.storeForm.controls
  }

  saveStore(): void {
    this.submitted = true
    if (this.storeForm.invalid) {
      return
    }
    if (this.route.snapshot.params.storeId) {
      return this.updateStoreById()
    }
    this.storeService.createStore(this.storeForm.value).subscribe(
      () => {
        this.router.navigate(['/stores'])
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  getStoreById(storeId): void {
    this.storeService.getStoreById(storeId).subscribe(response => {
      this.storeObj = response
    })
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  updateStoreById(): void {
    this.submitted = true
    if (this.storeForm.invalid) {
      return
    }
    this.storeService
      .updateStore(this.route.snapshot.params.storeId, this.storeForm.value)
      .subscribe(
        () => {
          this.submitted = true
          this.router.navigate(['/stores'])
        },
        error => {
          this.handleError(error.message)
        }
      )
  }
}
