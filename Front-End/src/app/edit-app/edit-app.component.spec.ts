import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'

import {EditAppComponent} from './edit-app.component'

describe('EditAppComponent', () => {
  let component: EditAppComponent
  let fixture: ComponentFixture<EditAppComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditAppComponent]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
