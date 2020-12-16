import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Friend from '../model/friends';
import { NavController, ToastController } from '@ionic/angular';
import UserFriend from '../model/userFriend';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  public data_teman;
  public cekSudahAdd;
  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) { }

  getFriend(user): Observable<UserFriend[]> {
    return this.firestore.collection<UserFriend>('user_friend', ref => {
      return ref.where('user', '==', user);
    }).valueChanges();
  }

  addFriend(user: string, nama_teman: string){
    const id = this.firestore.createId();

    this.firestore.collection<Friend>('friend').ref.where('nama_teman', '==', nama_teman).get().then((res) => {
      this.data_teman = res.docs.map(doc => doc.data());
      if(!this.data_teman.length){ 
        this.presentToast();
      } else {
        const latitude = this.data_teman[0].latitude_teman
        const longitude = this.data_teman[0].longitude_teman
        return this.firestore.doc(`user_friend/${id}`).set({
          id,
          user,
          nama_teman,
          latitude,
          longitude
        });
      }
    });
  }

  deleteFriend(id: string): Promise<void> {
    return this.firestore.doc(`user_friend/${id}`).delete();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Teman tidak tersedia.',
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }
}