/* eslint-disable filenames/match-regex */
import {Component, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {NotificationService} from '../notification.service'
@Component({
  selector: 'app-add-edit-notification',
  templateUrl: './add-edit-notification.component.html',
  styleUrls: ['./add-edit-notification.component.css']
})
export class AddEditNotificationComponent implements OnInit {
  notificationForm: FormGroup
  notification = {name: '', notificationType: '', storeFk: 0}
  escalation = {}
  isEscalation = false
  submitted = false
  storeId: number
  notificationType = ''
  isEscalationRequired = true
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // this.notiID = this.route.snapshot.params['id']
    // this.fetchNotificationById(this.notiID)
    this.storeId = this.route.snapshot.params['storeId']
    this.fetchNotificationById(this.storeId)
    this.notificationForm = this.formBuilder.group({
      settingName: ['', Validators.required],
      notificationType: ['', Validators.required],
      to: '',
      storeFk: this.storeId,
      isEscalationRequired: false,
      noOfRemainder: '',
      timeToEscalate: '',
      escalationType: ''
    })
  }

  get f(): {[key: string]: AbstractControl} {
    return this.notificationForm.controls
  }

  fetchNotificationById(id): void {
    this.notificationService.fetchNotificationById(id).subscribe(response => {
      this.notification = response
      this.escalation = response.notification.escalation[0]
      if (response.notification.isEscalationRequired) {
        this.isEscalation = true
        this.isEscalationRequired = false
      } else {
        this.isEscalation = false
        this.isEscalationRequired = true
      }
    })
  }

  onChangeEscalationLevel(e): void {
    this.notificationForm.value.escalationType = e
  }

  changenotificationType(e): void {
    this.notificationForm.value.notificationType = e
  }

  onChangeRemainder(e): void {
    this.notificationForm.value.noOfRemainder = e
  }

  onChangeTimeInterval(e): void {
    this.notificationForm.value.timeToEscalate = e
  }

  onCheckboxChange(e): void {
    if (e.target.checked) {
      this.isEscalation = true
      this.isEscalationRequired = false
    } else {
      this.isEscalation = false
      this.isEscalationRequired = true
    }
  }

  saveNotification(): void {
    this.submitted = true
    if (this.notificationForm.invalid) {
      return
    }
    this.notificationForm.value.isEscalationRequired = this.isEscalation
    this.notificationService
      .createNotificationSetting(this.notificationForm.value)
      .subscribe(
        () => {
          this.router.navigate(['/fetchNotification', this.storeId])
        },
        error => {
          this.handleError(error.message)
        }
      )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  fetchNotification(): void {
    this.router.navigate(['/fetchNotification', this.storeId])
  }
}
