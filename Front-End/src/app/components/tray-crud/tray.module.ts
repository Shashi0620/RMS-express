import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {TrayComponent} from './tray.component'
import {KtdGridModule} from '@katoid/angular-grid-layout'
import {MatButtonModule} from '@angular/material/button'
import {MatSelectModule} from '@angular/material/select'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input'
import {MatChipsModule} from '@angular/material/chips'
import {MatTableModule} from '@angular/material/table'
import {MatMenuModule} from '@angular/material/menu'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ColorSketchModule} from 'ngx-color/sketch'
import {UploadFilesComponent} from '../upload-files/upload-files.component'
import {ItemListingComponent} from '../item-crud/item-listing.component'
import {NgxNumberSpinnerModule} from 'ngx-number-spinner'
import {FormlistQuantityComponent} from 'src/app/formlist-quantity/formlist-quantity.component'
import {MatPaginatorModule} from '@angular/material/paginator'
import {NgSelectModule} from '@ng-select/ng-select'

@NgModule({
  declarations: [
    TrayComponent,
    UploadFilesComponent,
    ItemListingComponent,
    FormlistQuantityComponent
  ],
  exports: [TrayComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KtdGridModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatChipsModule,
    ColorSketchModule,
    MatTableModule,
    MatMenuModule,
    NgSelectModule,
    MatSlideToggleModule,
    NgxNumberSpinnerModule,
    MatPaginatorModule
  ]
})
export class TrayModule {}
