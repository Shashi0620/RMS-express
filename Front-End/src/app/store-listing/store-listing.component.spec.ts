import {ComponentFixture, TestBed} from '@angular/core/testing'

import {StoreListingComponent} from './store-listing.component'

describe('StoreListingComponent', () => {
  let component: StoreListingComponent
  let fixture: ComponentFixture<StoreListingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreListingComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
