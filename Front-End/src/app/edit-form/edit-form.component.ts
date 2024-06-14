import {Component, OnInit} from '@angular/core'
import {DndDropEvent, DropEffect} from 'ngx-drag-drop'
import {field, value} from '../global.model'
import {ActivatedRoute, Router} from '@angular/router'
import swal from 'sweetalert2'
import {FormService} from '../services/app.form.service'
import {Client} from '../client'
import {User} from '../models/user.model'
import {Menu} from '../models/menu.model'

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  value: value = {
    label: '',
    value: ''
  }
  success = false

  fieldModels: field[] = [
    {
      type: 'text',
      icon: 'fa-font',
      label: 'Text',
      description: 'Enter your name',
      placeholder: 'Enter your name',
      className: 'form-control',
      subtype: 'text',
      regex: '',
      handle: true
    },
    {
      type: 'email',
      icon: 'fa-envelope',
      required: true,
      label: 'Email',
      description: 'Enter your email',
      placeholder: 'Enter your email',
      className: 'form-control',
      subtype: 'text',
      regex: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
      errorText: 'Please enter a valid email',
      handle: true
    },
    {
      type: 'phone',
      icon: 'fa-phone',
      label: 'Phone',
      description: 'Enter your phone',
      placeholder: 'Enter your phone',
      className: 'form-control',
      subtype: 'text',
      regex: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
      errorText: 'Please enter a valid phone number',
      handle: true
    },
    {
      type: 'number',
      label: 'Number',
      icon: 'fa-html5',
      description: 'Age',
      placeholder: 'Enter your age',
      className: 'form-control',
      value: '20',
      min: 12,
      max: 90
    },
    {
      type: 'date',
      icon: 'fa-calendar',
      label: 'Date',
      placeholder: 'Date',
      className: 'form-control'
    },
    {
      type: 'datetime-local',
      icon: 'fa-calendar',
      label: 'DateTime',
      placeholder: 'Date Time',
      className: 'form-control'
    },
    {
      type: 'textarea',
      icon: 'fa-text-width',
      label: 'Textarea'
    },
    {
      type: 'paragraph',
      icon: 'fa-paragraph',
      label: 'Paragraph',
      placeholder: 'Type your text to display here only'
    },
    {
      type: 'checkbox',
      required: true,
      label: 'Checkbox',
      icon: 'fa-list',
      description: 'Checkbox',
      inline: true,
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        }
      ]
    },
    {
      type: 'radio',
      icon: 'fa-list-ul',
      label: 'Radio',
      description: 'Radio boxes',
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        }
      ]
    },
    {
      type: 'autocomplete',
      icon: 'fa-bars',
      label: 'Select',
      description: 'Select',
      placeholder: 'Select',
      className: 'form-control',
      values: [
        {
          label: 'Option 1',
          value: 'option-1'
        },
        {
          label: 'Option 2',
          value: 'option-2'
        },
        {
          label: 'Option 3',
          value: 'option-3'
        }
      ]
    },
    {
      type: 'file',
      icon: 'fa-file',
      label: 'File Upload',
      className: 'form-control',
      subtype: 'file'
    },
    {
      type: 'button',
      icon: 'fa-paper-plane',
      subtype: 'submit',
      label: 'Submit'
    }
  ]

  modelFields: field[] = []
  model: any = {
    name: '',
    description: '',
    theme: {
      bgColor: 'ffffff',
      textColor: '555555',
      bannerImage: ''
    },
    attributes: this.modelFields
  }

  report = false
  reports: any = []
  UserObj: User = {}
  menuObj: Menu = {}
  clientFk: number
  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private router: Router
  ) {}

  ngOnInit() {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.getFormData(
      this.route.snapshot.params.name,
      this.route.snapshot.params.id
    )
    this.getMenyById(this.route.snapshot.params.id)
  }

  getFormData(name: string, id: number): void {
    let datas
    this.formService.getById(name, id).subscribe(
      data => {
        datas = data
        if (Array.isArray(datas.attributes)) {
          datas.attributes = datas.attributes
        } else {
          datas.attributes = JSON.parse(datas.attributes)
        }

        if (datas.attributes === null || datas.attributes === undefined) {
          this.model.attributes = []
        } else {
          this.model.attributes = datas.attributes
        }
        this.model.name = datas.name
        this.model.description = datas.description

        console.log(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  onDragStart(event: DragEvent): void {
    console.log('drag started', JSON.stringify(event, null, 2))
  }

  onDragEnd(event: DragEvent): void {
    console.log('drag ended', JSON.stringify(event, null, 2))
  }

  onDraggableCopied(event: DragEvent): void {
    console.log('draggable copied', JSON.stringify(event, null, 2))
  }

  onDraggableLinked(event: DragEvent): void {
    console.log('draggable linked', JSON.stringify(event, null, 2))
  }

  onDragged(item: any, list: any[], effect: DropEffect): void {
    if (effect === 'move') {
      const index = list.indexOf(item)
      list.splice(index, 1)
    }
  }

  onDragCanceled(event: DragEvent): void {
    console.log('drag cancelled', JSON.stringify(event, null, 2))
  }

  onDragover(event: DragEvent): void {
    console.log('dragover', JSON.stringify(event, null, 2))
  }

  onDrop(event: DndDropEvent, list?: any[]): void {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      if (event.dropEffect === 'copy') {
        event.data.name = `${event.data.type}-${new Date().getTime()}`
      }
      let index = event.index
      if (typeof index === 'undefined') {
        index = list.length
      }
      list.splice(index, 0, event.data)
    }
  }

  addValue(values): void {
    values.push(this.value)
    this.value = {label: '', value: ''}
  }

  removeField(i): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this field?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.model.attributes.splice(i, 1)
      }
    })
  }

  updateForm(): void {
    const input = new FormData()
    input.append('id', this.model._id)
    input.append('name', this.model.name)
    input.append('description', this.model.description)
    input.append('bannerImage', this.model.theme.bannerImage)
    input.append('bgColor', this.model.theme.bgColor)
    input.append('textColor', this.model.theme.textColor)
    input.append('attributes', JSON.stringify(this.model.attributes))
  }

  saveForm(): void {
    const data = {
      name: this.model.name,
      description: this.model.description
    }

    this.formService.saveForm(data).subscribe(
      response => {
        console.log(response)
        // this.submitted = true;
      },
      error => {
        console.log(error)
      }
    )
  }

  initReport(): void {
    this.report = true
    const input = {
      id: this.model._id
    }
  }

  toggleValue(item): void {
    item.selected = !item.selected
  }

  getMenyById(id): void {
    this.formService.getMenyById(id).subscribe(
      data => {
        this.menuObj = data[0]
      },
      error => {
        console.log(error)
      }
    )
  }

  submit(): void {
    console.log('Save', this.model)
    const input = new FormData()
    input.append('formId', this.model._id)
    input.append('attributes', JSON.stringify(this.model.attributes))
    const data = {
      name: this.model.name,
      description: this.model.description,
      attributes: this.model.attributes
    }
    const menuId = this.menuObj.id
    this.formService
      .updateForm(
        this.route.snapshot.params.id,
        this.route.snapshot.params.name,
        this.model,
        menuId
      )
      .subscribe(
        response => {
          console.log(response)
          this.success = true
          this.router.navigate(['/template']).then(() => {
            window.location.reload()
          })
          this.formService.getAll(this.clientFk)
          // this.submitted = true;
        },
        error => {
          console.log(error)
        }
      )
  }

  cancel(): void {
    this.router.navigate(['/template'])
    this.formService.getAll(this.clientFk)
  }
}
