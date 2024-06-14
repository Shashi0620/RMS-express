import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EditFormComponent} from './edit-product.component'

describe('EditFormComponent', () => {
  let component: EditFormComponent
  let fixture: ComponentFixture<EditFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFormComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
