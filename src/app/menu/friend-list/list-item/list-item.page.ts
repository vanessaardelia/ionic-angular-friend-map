import { Component, OnInit } from '@angular/core';
import Friend from 'src/app/model/friends';
import { FriendsService } from 'src/app/services/friends.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IonItemSliding, AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import UserFriend from 'src/app/model/userFriend';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.page.html',
  styleUrls: ['./list-item.page.scss'],
})
export class ListItemPage implements OnInit {
  public friendList: UserFriend[];
  public friendFilter: UserFriend[];
  public userProfile: any;
  public data: any;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private friendService: FriendsService,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getFriendList();
  }

  goToAdd(){
    this.router.navigate(['/menu/tabs/friend-list/add']);
  }

  getFriendList() {
    this.authService.getUserData().subscribe(res => {
      this.userProfile = res;
      this.friendService.getFriend(this.userProfile.name).pipe(
          map(async friendList => {
            return friendList;
          })
      ).subscribe(async friendList => {
        this.friendList = await friendList;
        this.friendFilter = await friendList;
      });
    });
  }

  async search($event) {
    const searchTerm = $event.srcElement.value;
    if (!searchTerm) {
      this.friendFilter = this.friendList;
      return;
    }
    this.friendFilter = this.friendList.filter(friend => {
      if (friend.nama_teman && searchTerm) {
        return (friend.nama_teman.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
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
            this.authService.getUserData().subscribe(res => {
              this.userProfile = res;
              this.firestore.collection<UserFriend>('user_friend').ref.where('user', '==', this.userProfile.name).where('nama_teman', '==', nama).get().then((res) => {
                this.data = res.docs.map(doc => doc.data());
                const id = this.data[0].id;
                this.friendService.deleteFriend(id);
              });
            });
          }
        },
      ]
    });
    await alert.present();
  }

}
