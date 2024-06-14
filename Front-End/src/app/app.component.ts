/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable github/no-then */
/* eslint-disable filenames/match-regex */
import {ActivatedRoute, Router} from '@angular/router'
import {Component} from '@angular/core'
import {MenuService} from './services/menu.service'
import {Menu} from './models/menu.model'
import {ItemService} from './services/item.service'
import {UserProfileService} from './services/user-profile.service'
import {Profile} from './models/userProfile.model'
import {UploadFilesService} from './services/upload-files.service'
import {UserService} from './services/user.service'
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js'
import {Plan} from './models/plan.model'
import {Notification} from './models/notification.model'
import {environment} from '../environments/environment'
import swal from 'sweetalert2'
import {Item} from './models/item.model'
import {User} from './models/user.model'
import {Label} from 'ng2-charts'
const userLogin = environment.isUserLoggedIn
const serverBaseURL = environment.baseUrl

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  barChartOptions: ChartOptions = {
    responsive: true
  }
  barChartLabels: Label[] = ['rate']
  barChartType: ChartType = 'bar'
  barChartLegend = true
  barChartPlugins = []

  barChartData: ChartDataSets[] = [
    {data: [], label: ''},
    {data: [], label: ''},
    {data: [], label: ''}
  ]

  itemPk: number
  profile: Profile = {
    id: 0,
    userName: '',
    email: '',
    address: '',
    city: '',
    image: '',
    phone: '',
    user_fk: 0
  }

  plan: Plan = {
    name: '',
    planImg: '',
    rate: 0
  }

  itemlabel: string
  afterClickOnNotification = true
  itemObject: Item
  dataObject: Menu
  menuObject: Menu[]
  notifications: Notification
  id: number
  planList: Plan[]
  img: ''
  objectKeys = Object.keys
  menu: Menu = {
    label: '',
    action: '',
    menu_fk: 0,
    roleId: 0,
    itemId: 0
  }

  file: any = {
    filename: '',
    filepath: `${serverBaseURL}/files/profile/`,
    user_fk: 0
  }
  notificationImage = environment.notificationStatusSent
  notificationStatusNew = environment.notificationStatusNew
  jsonData: any
  constructor(
    private menuService: MenuService,
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private userProfile: UserProfileService,
    private uploadService: UploadFilesService,
    private userService: UserService,
    private router: Router
  ) {}
  UserObj: User = {}
  PlanObj: any = {}
  RoleObj: any = {}
  MenuObject: any = {}

  isSuperAdmin = false
  isOtherUser = true
  isPlanImg = true
  MenuTranslateCollection
  ngOnInit(): void {
    this.getPlans()
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'))
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'))
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'))

    if (this.RoleObj[0].name === userLogin) {
      this.isSuperAdmin = true
      this.isOtherUser = false
    }
    this.fetchNotificationByUserFk(this.UserObj.id)
    this.fetchFile(this.UserObj.id)

    this.itemPk = this.activatedRoute.snapshot.params['id']
    this.fetchAllmenus()
    this.getAllMenuData(this.UserObj.username)
  }

  fetchItemById(itemId: number): void {
    this.itemService.getItemById(itemId).subscribe(
      data => {
        this.itemObject = data
        this.createMenu(this.menu)
      },
      error => {
        this.handleError(error.message)
      }
    )
  }
  getAllMenuData(username): void {
    this.userService.getAllMenuData(username).subscribe(response => {
      var data = response
      data.map(datavalues =>
        localStorage.setItem(datavalues.Key, datavalues.Value)
      )
    })
  }
  createMenu(menu: Menu): void {
    const data = {
      label: this.itemObject.name,
      action: `menu/${this.itemObject.name}/${this.itemObject.id}`,
      menu_fk: 1,
      roleId: 1,
      itemId: this.itemObject.id
    }

    this.menuService.createMenu(data).subscribe(
      (data: Menu) => {
        this.dataObject = data
        this.fetchAllmenus()
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  fetchAllRacks(): void {
    this.id = this.UserObj.clientFk
    this.router.navigate(['/rackList', this.id])
  }
  fetchAllmenus(): void {
    this.menuService
      .fetchAllMenus(this.UserObj.clientFk, this.UserObj.roleId)
      .subscribe(
        data => {
          if (this.PlanObj[0].name === 'Personal') {
            this.menuObject = data.filter(menus => menus.label !== 'Stores')
          } else {
            var updatedMenuList = data.map(item => {
              var localStorageValue = localStorage.getItem(item.label)
              if (localStorageValue != null) {
                item.label = localStorageValue
              }
              return item
            })
            this.menuObject = updatedMenuList
          }
        },
        error => {
          this.handleError(error.message)
        }
      )
  }

  redirect(): void {
    this.router.navigate(['/action'])
  }

  logout(): void {
    swal({
      title: 'Are you sure?',
      text: 'Do You Want To Logout ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.value) {
        this.userLogout()
      }
    })
  }

  userLogout(): void {
    window.sessionStorage.clear()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }

  refreshPage(action: string): void {
    this.router.navigate([`/${action}`])
  }

  fetchUserProfileFK(): void {
    this.id = this.UserObj.id
    this.userProfile.fetchProfileByUserFK(this.id).subscribe(
      response => {
        this.profile = response
        this.fetchFile(this.id)
        this.router.navigate(['/userProfile', this.profile[0].id])
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  fetchFile(user_fk: number): void {
    this.uploadService.fetchFile(user_fk).subscribe(response => {
      this.profile.image = this.file.filepath + response[0].filename
    })
  }

  handleError(err: ErrorEvent): void {
    alert(err)
  }

  changePasswordByUserFk(): void {
    this.id = this.UserObj.clientFk
    this.router.navigate(['/changePassword', this.id])
  }

  getPlans(): void {
    this.userService.getPlansList().subscribe(
      data => {
        this.planList = data
        if (this.RoleObj[0].name === userLogin) {
          this.isPlanImg = false
        }
        this.plan.planImg = this.PlanObj[0].planImg
      },
      error => {
        this.handleError(error.message)
      }
    )
  }

  labels(plans: Plan[]): void {
    for (let i = 0; i < plans.length; i++) {
      // this.barChartLabels.push(plans[i].name);
      this.barChartData[i].label = plans[i].name
      this.barChartData[i].data.push(plans[i].rate)
    }
  }

  fetchNotificationByUserFk(userFk: number): void {
    this.userService.fetchNotificationByUserFk(userFk).subscribe(response => {
      this.notifications = response
    })
  }

  fetchAllNotifications(): void {
    this.afterClickOnNotification = false
  }
}
