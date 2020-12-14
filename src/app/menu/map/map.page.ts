import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LokasiService } from 'src/app/services/lokasi.service';
import Friend from 'src/app/model/friends';
import { AngularFirestore } from '@angular/fire/firestore';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map;
  inputField: Boolean = false;
  validations_form: FormGroup;
  userProfile: any;
  latitude: Number = 0;
  longitude: Number = 0;
  public data_teman: any;
  updateLokasi;
  data;

  validation_messages = {
    'lokasi': [
      { type: 'required', message: 'Lokasi is required.' }
    ]
  };
  @ViewChild("map", { read: ElementRef, static: true }) private mapElement: ElementRef;
  constructor(
    private geolocation: Geolocation,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private lokasiService: LokasiService,
    private firestore:AngularFirestore
  ) {}
  
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      lokasi: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ionViewWillEnter() {
    this.loadmap();
  }

  loadmap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // get friend location
      this.authService.getUserData().subscribe(res => {
        this.userProfile = res;
        this.firestore.collection<Friend>('user_friend', ref => {
          return ref.where('user', '==', this.userProfile.name);
        }).valueChanges().subscribe(res => {
          this.data_teman = res;
          var marker, i;

          // add lokasi teman
          for (i = 0; i < this.data_teman.length; i++) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(parseFloat(this.data_teman[i].latitude), parseFloat(this.data_teman[i].longitude)),
              map: map
            });

            let content = "<p> lokasi "+ this.data_teman[i].nama_teman +"</p>";
            let infoWindow = new google.maps.InfoWindow({
              content: content
            });
            google.maps.event.addListener(marker, 'click', () => {
              infoWindow.open(this.map, marker);
            });
          }
        });
      });

      // center di lokasi saya skrng
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // add lokasi saya
      let markers = new google.maps.Marker({
        map: map,
        position: map.getCenter()
      });
      
      this.authService.getUserData().subscribe(res => {
        this.userProfile = res;
        let content = "<p> lokasi "+ this.userProfile.name +"</p>";
        this.addInfoWindow(markers, content);

        const id = this.firestore.createId();
        this.firestore.doc(`lokasi_user/${id}`).set({
          id: id,
          name: this.userProfile.name,
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude
        });

        // update setiap 10 menit
        this.updateLokasi = setInterval(() => {
          this.firestore.doc(`lokasi_user/${id}`).update({
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          });
        }, 60000);
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  goToCenter(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // center di lokasi saya skrng
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // add lokasi saya
      let markers = new google.maps.Marker({
        map: map,
        position: map.getCenter()
      });
    });
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  inputData(){
    this.inputField = true;
  }

  resetInput() {
    this.inputField = false;
  }
  
  addLokasi(value){
    this.authService.getUserData().subscribe(res => {
      this.userProfile = res;
      this.lokasiService.addLokasi(this.userProfile.name, value.lokasi, this.latitude, this.longitude);
      this.inputField = false;
      this.validations_form.reset();
    });
  }

  ngOnDestroy() {
    clearInterval(this.updateLokasi);
  }
}
