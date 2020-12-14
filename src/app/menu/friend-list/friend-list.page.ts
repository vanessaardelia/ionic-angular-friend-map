import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { FriendsService } from 'src/app/services/friends.service';
import UserFriend from 'src/app/model/userFriend';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.page.html',
  styleUrls: ['./friend-list.page.scss'],
})
export class FriendListPage implements OnInit {
  userProfile: any;
  public data_teman: any;
  public data: any;

  constructor(
    private router: Router,
    private firestore:AngularFirestore,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private friendService: FriendsService
  ) { }

  ngOnInit() {
    // this.authService.getUserData().subscribe(res => {
    //   this.userProfile = res;
    //   this.firestore.collection<UserFriend>('user_friend', ref => {
    //     return ref.where('user', '==', this.userProfile.name);
    //   }).valueChanges().subscribe(res => {
    //     this.data_teman = res;
    //   });
    // });
  }

  ionViewWillEnter() {
    this.authService.getUserData().subscribe(res => {
      this.userProfile = res;
      this.firestore.collection<UserFriend>('user_friend', ref => {
        return ref.where('user', '==', this.userProfile.name);
      }).valueChanges().subscribe(res => {
        this.data_teman = res;
      });
    });
  }

  goToAdd(){
    this.router.navigate(['/menu/tabs/friend-list/add']);
  }

  goToListItem() {
    this.navCtrl.navigateForward(`/menu/tabs/friend-list/list-item`);
  }

  async presentAlert(nama) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Teman',
      message: 'Apakah yakin ingin menghapus? Jika sudah dihapus, tidak bisa dikembalikan lagi.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler: () => {
            this.delete(nama);
          }
        }
      ]
    });
    await alert.present();
  }

  delete(nama){
    this.authService.getUserData().subscribe(res => {
      this.userProfile = res;
      this.firestore.collection<UserFriend>('user_friend').ref.where('user', '==', this.userProfile.name).where('nama_teman', '==', nama).get().then((res) => {
        this.data = res.docs.map(doc => {
          doc.data()
          this.friendService.deleteFriend(doc.data().id);
        });
      });
    });
  }

}
