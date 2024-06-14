import {ComponentFixture, TestBed} from '@angular/core/testing'

import {FormlistQuantityComponent} from './formlist-quantity.component'

describe('FormlistQuantityComponent', () => {
  let component: FormlistQuantityComponent
  let fixture: ComponentFixture<FormlistQuantityComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlistQuantityComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlistQuantityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
