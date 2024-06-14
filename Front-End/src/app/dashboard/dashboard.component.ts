import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import {ActivatedRoute} from '@angular/router'
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview'
import {RackService} from '../services/rack.service'
import {MapsAPILoader} from '@agm/core'
import {Tray} from '../models/tray.model'
//import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  [x: string]: any

  //  lat = 51.678418;
  //  lng = 7.809007;

  latitude: number
  longitude: number
  zoom: number
  address: string
  private geoCoder

  @ViewChild('search')
  searchElementRef: ElementRef
  displayedColumns: string[] = ['storeName']

  isQuantity = false
  search = ''
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  dataSource = new MatTableDataSource<any>()
  constructor(
    private route: ActivatedRoute,
    private rackService: RackService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.setCurrentLocation()

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation()
      this.geoCoder = new google.maps.Geocoder()

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      )
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace()

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat()
          this.longitude = place.geometry.location.lng()
          this.zoom = 12
        })
      })
    })
  }

  searchTray(): void {
    this.rackService.fetchTrays(this.search).subscribe((data: Tray[]) => {
      this.dataSource.data = data
      if (this.dataSource.data.length > 0) {
        this.isQuantity = true
      }
    })
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.zoom = 8
        this.getAddress(this.latitude, this.longitude)
      })
    }
  }

  getAddress(latitude, longitude): void {
    this.geoCoder.geocode(
      {location: {lat: latitude, lng: longitude}},
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12
            this.address = results[0].formatted_address
          } else {
            window.alert('No results found')
          }
        } else {
          window.alert(`Geocoder failed due to: ${status}`)
        }
      }
    )
  }
}
