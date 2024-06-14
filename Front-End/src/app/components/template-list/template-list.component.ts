/* eslint-disable no-undef */
/* eslint-disable github/no-then */
/* eslint-disable filenames/match-regex */
import {Component, OnInit, ViewChild} from '@angular/core'
import {Template} from '../../models/template.model'
import {FormService} from '../../services/app.form.service'
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import swal from 'sweetalert2'
import {ItemService} from '../../services/item.service'
import {User} from '../../models/user.model'
import {Router} from '@angular/router'

@Component({
  selector: 'app-Templates-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  Templates?: Template[]
  currentTemplate?: Template
  currentIndex = -1
  name = ''
  roleId: ''
  UserObj: User = {}
  clientFk: number
  displayedColumns: string[] = ['Name', 'Description', 'Actions']
  dataList: Template[]
  dataSource = new MatTableDataSource<Template>()
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    private formService: FormService,
    private itemService: ItemService,
    private router: Router
  ) {}
  RoleObj: any = {}
  RoleName = ''

  ngOnInit(): void {
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))
    this.RoleName = this.RoleObj[0].name
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.clientFk = this.UserObj.clientFk
    this.retrieveTemplates()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue
  }

  retrieveTemplates(): void {
    this.formService.getAll(this.clientFk).subscribe(
      data => {
        // this.Templates = data;
        this.dataSource.data = data

        this.dataList = data
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  refreshList(): void {
    this.retrieveTemplates()
    this.currentTemplate = undefined
    this.currentIndex = -1
  }

  setActiveTemplate(template: Template, index: number): void {
    this.currentTemplate = template
    this.currentIndex = index
  }

  removeAllTemplates(): void {
    this.formService.deleteAll().subscribe(
      () => {
        this.refreshList()
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  searchTitle(): void {
    this.currentTemplate = undefined
    this.currentIndex = -1

    this.formService.findByTitle(this.name).subscribe(
      data => {
        this.Templates = data
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  deleteTemplate(id, name): void {
    this.formService.delete(id, name).subscribe(
      () => {
        this.formService.getAll(this.clientFk)
        this.router.navigate(['/template']).then(() => {
          window.location.reload()
        })
      },
      error => {
        this.handleError(error.message)
      }
    )
  }
  handleError(err: ErrorEvent): void {
    alert(err)
  }

  removeTemplate(id, name): void {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this template?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(result => {
      if (result.value) {
        this.deleteTemplate(id, name)
      }
    })
  }
}
