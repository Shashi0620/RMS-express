import {ComponentFixture, TestBed} from '@angular/core/testing'

import {EditRackComponent} from './edit-rack.component'

describe('EditRackComponent', () => {
  let component: EditRackComponent
  let fixture: ComponentFixture<EditRackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRackComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
