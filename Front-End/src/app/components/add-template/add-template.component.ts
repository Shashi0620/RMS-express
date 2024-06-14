/* eslint-disable filenames/match-regex */
import {Component, OnInit} from '@angular/core'
import {Template} from '../../models/template.model'
import {FormService} from './../../services/app.form.service'

@Component({
  selector: 'app-add-Template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {
  Template: Template = {
    name: '',
    subscriberId: ''
  }
  submitted = false

  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  saveTemplate(): void {
    const data = {
      name: this.Template.name,
      subscriberId: this.Template.subscriberId
    }

    this.formService.create(data).subscribe(
      () => {
        this.submitted = true
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  newTemplate(): void {
    this.submitted = false
    this.Template = {
      name: '',
      subscriberId: ''
    }
  }
}
