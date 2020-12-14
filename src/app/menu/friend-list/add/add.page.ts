import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/services/friends.service';
import { ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import Friend from 'src/app/model/friends';
import UserFriend from 'src/app/model/userFriend';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  form: FormGroup;
  userProfile: any;
  public data_teman: any;
  public cekSudahAdd;
  public addTeman: Boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private friendService: FriendsService,
    private toastController: ToastController,
    private firestore:AngularFirestore
  ) { }

  ngOnInit() {
    this.form = new FormGroup( {
      nama_teman: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    var add: Boolean = false;
    const nama_teman = this.form.value.nama_teman;
    if(!nama_teman){
      this.presentToast();
    }else{
      this.authService.getUserData().subscribe(ref => {
        this.userProfile = ref;
        this.firestore.collection<UserFriend>('user_friend').ref.where('user', '==', this.userProfile.name).where('nama_teman', '==', nama_teman).get().then((res) => {
          this.cekSudahAdd = res;
          if(!this.cekSudahAdd.length){
            if(add === false){
              this.friendService.addFriend(this.userProfile.name, nama_teman)
              this.router.navigate(['/menu/tabs/friend-list']);
              this.addTeman = true;
              this.form.reset();
              add = true;
            }
          } else {
            if(!this.addTeman){
              this.presentToast2();
            }
          }
        });
      });
    }
  }

  onCancel(){
    this.router.navigate(['/menu/tabs/friend-list']);
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Teman sudah di add.',
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Masukkan nama teman.',
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }

}
