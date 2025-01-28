import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../globals';

@Component({
  selector: 'an-profile',
  standalone: false,

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {

  constructor(private http: HttpClient) { }

  loginEmail: string = '';
  loginPassword: string = '';
  userEmail: string = '';
  userPassword: string = '';
  userFirstname: string = '';
  userLastname: string = '';
  regFirstname: string = '';
  regLastname: string = '';
  regEmail: string = '';
  regPassword: string = '';
  regRepPassword: string = '';
  loginVisible: boolean = false;
  profileVisible: boolean = false;
  registerVisible: boolean = false;

  ngOnInit() {
    var token = localStorage.getItem('myToken');
    console.log('Current token:', token);

    if (token) this.showProfile();
    else this.showLogin();
  }

  showLogin() {
    this.loginVisible = true;
    this.profileVisible = false;
    this.registerVisible = false;
  }

  showProfile(): void {
    this.loginVisible = false;
    this.profileVisible = true;
    this.registerVisible = false;

    var token = localStorage.getItem('myToken');
    if (!token) return;
    this.http.get(`${config.apiUrl}/users?token=${token}`).subscribe({
      next: (data: any) => {
        console.log(data);

        this.userEmail = data.email;
        this.userPassword = data.password;
        this.userFirstname = data.firstName;
        this.userLastname = data.lastName;

      },
      error: (err) => {
        console.log('Error getting user data:', err);

      }
    })
  }

  showRegister(): void {
    this.loginVisible = false;
    this.profileVisible = false;
    this.registerVisible = true;
  }

  loginsubmit(): void {
    const login = {
      email: this.loginEmail,
      password: this.loginPassword,
    };

    console.log('Attempting login:', login);

    this.http.post(`${config.apiUrl}/auth`, login, {
    }).subscribe({
      next: (data: any) => {
        localStorage.setItem('myToken', data.token);
        this.showProfile();
      },
      error: (err) => {
        console.error('Error during login:', err);
        alert('Login failed. Please check your email and password.');
      },
    });
  }

  logoutsubmit(): void {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    this.http.delete(`${config.apiUrl}/auth?token=${token}`).subscribe({
      next: (response) => {
        console.log('Logout', response);
        localStorage.removeItem('myToken');
        this.loginEmail = '';
        this.loginPassword = '';
        this.showLogin();
      },
      error: (err) => {
        console.error('Error during logout:', err);

        localStorage.removeItem('myToken');
        this.showLogin();
      },
    })
  }

  updateProfile(): void {
    var token = localStorage.getItem('myToken');
    if (!token) return;

    const tokenUser = {
      token: token,
      user: {
        email: this.userEmail,
        password: this.userPassword,
        firstName: this.userFirstname,
        lastName: this.userLastname
      }
    }

    this.http.put(`${config.apiUrl}/users`, tokenUser).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.showProfile()
      },
      error: (err) => {
        console.log('Error updating profile:', err);
      }
    })

    this.showProfile();
  }

  register(): void {

    var password = this.regPassword;
    var repPassword = this.regRepPassword;

    if (password !== repPassword) {
      alert("Passwords do not match");
      return;
    }

    var newUser = {
      email: this.regEmail,
      password: this.regPassword,
      firstName: this.regFirstname,
      lastName: this.regLastname,
    }

    this.http.post(`${config.apiUrl}/users`, newUser).subscribe({
      next: (response) => {
        console.log('New user added:', response);
        alert("SignUp successful! Consider logging in. ;)")
        this.showLogin();
      },
      error: (err) => {
        console.log('Could not add new User:', err);

      }
    })


  }
}
