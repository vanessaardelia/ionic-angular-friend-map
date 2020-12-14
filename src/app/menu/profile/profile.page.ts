import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import Lokasi from 'src/app/model/Lokasi';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: any;
  public lokasi: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navController: NavController,
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.authService.getUserData().subscribe(ref => {
      this.authService.getUserPhotoUrl(ref.photo).subscribe(res => {
        this.userProfile = ref;
        this.userProfile.photo = res;
      });
    });
    this.getLokasi()
  }

  getLokasi(){
    this.authService.getUserData().subscribe(res => {
      this.userProfile = res;
      this.firestore.collection<Lokasi>('lokasi', ref => {
        return ref.where('user', '==', this.userProfile.name);
      }).valueChanges().subscribe(res => {
        this.lokasi = res;
      });
    });
  }

  edit(){
    this.router.navigate(['/menu/tabs/profile/edit']);
  }

  logout(){
    this.authService.logout().then(res => {
      this.router.navigateByUrl('/login');
    }).catch(error => { console.log(error) })
  }

  selectItem(uid) {
    this.confirmationAlert(uid)
  }

  async confirmationAlert(uid) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi penghapusan feed',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.deleteLokasi(uid);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }
      ]
    });

    await alert.present();
  }

  deleteLokasi(uid){
    this.navController.navigateForward(`/menu/tabs/profile`);
    return this.firestore.doc(`lokasi/${uid}`).delete();
  }
}
