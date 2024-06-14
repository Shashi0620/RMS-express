/* eslint-disable filenames/match-regex */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {User} from '../../models/user.model'
import {Profile} from '../../models/userProfile.model'
import {UserProfileService} from '../../services/user-profile.service'
import {AlertService} from '../_alert/alert.service'
import {ConfirmedValidator} from './validator'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  id: number
  passChanged = false
  profileObject: Profile
  profile: Profile = {
    password: '',
    confirmPassword: '',
    user_fk: 0,
    email: ''
  }
  UserObj: User = {}

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  constructor(
    private router: Router,
    private userProfile: UserProfileService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword')
      }
    )
  }

  get f(): {[key: string]: AbstractControl} {
    return this.form.controls
  }

  submit(): void {
    this.updatePassword()
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.id = this.route.snapshot.params.id
    this.profile.user_fk = this.id
    this.profile.email = this.UserObj.email
  }

  async updatePassword(): Promise<Profile> {
    try {
      this.profileObject = await this.userProfile
        .updatePassword(this.UserObj.id, this.profile)
        .toPromise()
      this.passChanged = true
      return this.profileObject
    } catch (error) {
      this.handleError(error.message)
    }
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  logout(): void {
    window.sessionStorage.clear()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }
}
