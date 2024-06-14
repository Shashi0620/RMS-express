/* eslint-disable filenames/match-regex */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {Router} from '@angular/router'
import {User} from '../../models/user.model'
import {UserService} from '../../services/user.service'
import {AlertService} from '../_alert/alert.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup = new FormGroup({})
  email = ''
  user: User = {
    email: this.email,
    clientFk: 0
  }

  UserObj: User = {}
  userObject: User
  isForgotPassword = true
  isUserRegister = false

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.forgotPasswordForm = formBuilder.group({
      email: ['', [Validators.required]]
    })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.forgotPasswordForm.controls
  }

  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
  }

  submit(): void {
    this.reset()
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  reset(): void {
    this.userService.resetPassword(this.user).subscribe(
      response => {
        this.userObject = response
        this.isUserRegister = true
        this.isForgotPassword = false
      },
      error => {
        this.handleError(error.message)
      }
    )
  }
}
