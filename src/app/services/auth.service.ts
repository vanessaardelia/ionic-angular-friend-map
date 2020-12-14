import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  currentUser: User = null;
  userProfile: any;
  userData: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private userStore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
    ) {
      this.authenticate();
    }

  async authenticate() {
    await this.fireAuth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  async registerUser(userData) {
    const credential = await this.fireAuth.createUserWithEmailAndPassword(userData.email, userData.password);
    return this.userStore.doc(`users/${credential.user.uid}`).set({
      uid: credential.user.uid,
      email: userData.email,
      name: userData.namaDepan + ' ' + userData.namaBelakang,
      photo: 'account.svg',
      password: userData.password,
      confirmPassword: userData.confirmPassword
    });
  }

  loginUser({ email, password }) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.fireAuth.signOut();
  }

  getUserData(): Observable<any> {
    if(this.currentUser == null){
      this.router.navigate(['/login']);
    } else {
      return this.userStore.collection('users').doc(this.currentUser.uid).valueChanges();
    }
  }

  userDetails() {
    return this.fireAuth.user;
  }

  getUserPhotoUrl(imageName): Observable<any> {
    return this.storage.ref(`users/${imageName}`).getDownloadURL();
  }

  editUserData(photo) {
    this.getUserData().subscribe(ref => {
      this.userData = ref;
      if (this.userData.photo !== photo.oldPhoto) {
        this.uploadPhoto(photo.base64Photo, this.userData.email);
        this.userData.photo = this.userData.email + '.png';
      } else {
        this.userData.photo = photo.oldPhotoName;
      }
  
     this.userStore.doc(`users/${this.currentUser.uid}`).update({
        photo: this.userData.photo
      });
    });
  }

  uploadPhoto(imageString, email) {
    const storageRef = firebase.storage().ref(`users/${email}.png`);
    const uploadedPicture = storageRef.putString(imageString, 'base64', {
      contentType: 'image/png'
    });
    return uploadedPicture;
  }
}
