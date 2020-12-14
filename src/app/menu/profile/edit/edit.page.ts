import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {CameraResultType, Plugins} from '@capacitor/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

const { Camera } = Plugins;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  photo: any = {
    userPhoto: '',
    oldPhoto: '',
    oldPhotoName: '',
    base64Photo: '',
  };
  userProfile: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.authService.getUserData().subscribe(ref => {
      this.authService.getUserPhotoUrl(ref.photo).subscribe(res => {
        this.userProfile = ref;
        this.photo.userPhoto = res;
        this.photo.oldPhoto = res;
        this.photo.base64Photo = res;
        this.photo.oldPhotoName = ref.photo;
      });
    });
  }

  async takePicture() {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      this.photo.base64Photo = profilePicture.base64String;
      this.photo.userPhoto = 'data:image/png;base64,' + this.photo.base64Photo;
    } catch (error) {
    }
  }

  edit() {
    this.authService.editUserData(this.photo)
    this.router.navigateByUrl('/menu/tabs/profile', { replaceUrl: true });
  }

  cancel(){
    this.router.navigateByUrl('/menu/tabs/profile');
  }

  async confirmationAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Konfirmasi perubahan foto profile',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.edit();
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

}
