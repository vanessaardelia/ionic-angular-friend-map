import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Friend from '../model/friends';

@Injectable({
  providedIn: 'root'
})
export class LokasiService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  addLokasi(user: string, lokasi: string, latitude: Number, longitude: Number ){ 
    const id = this.firestore.createId();
    const date = new Date();

    return this.firestore.doc(`lokasi/${id}`).set({
      id,
      user,
      lokasi,
      date,
      latitude,
      longitude
    });
  }
}
