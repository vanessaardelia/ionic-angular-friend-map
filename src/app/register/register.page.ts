import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  check: Boolean;
  cancel: Boolean = false;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minLength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minLength', message: 'Confirm password must be at least 5 characters long.' }
    ],
    'namaDepan': [
      { type: 'required', message: 'Nama depan is required.' }
    ],
    'namaBelakang': [
      { type: 'required', message: 'Nama belakang is required.' }
    ]
  };
  
  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      namaDepan: new FormControl('', Validators.compose([
        Validators.required
      ])),
      namaBelakang: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  tryRegister(value) {
    if(this.check === true){
      if(value.password === value.confirmPassword){
        this.authSrv.registerUser(value)
        .then(res => {
          this.presentToast3();
          this.router.navigate(['/login']);
          this.validations_form.reset();
        }, err => {
          this.presentToast4(err.message);
        });
      } else {
        this.presentToast();
      }
    } else {
      if(this.cancel === false){
        this.presentToast2();
      }
    }
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

  goToLogin(){
    this.cancel = true;
    this.router.navigate(['/login']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Password dan confirm password tidak sama',
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Accept terms and condition',
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }

  async presentToast3() {
    const toast = await this.toastController.create({
      message: 'Your account has been created. Please log in.',
      duration: 2000,
      color: 'success',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }

  async presentToast4(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger',
      position: 'top',
      mode: 'ios'
    });
    toast.present();
  }
}
