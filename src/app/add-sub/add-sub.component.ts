import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../globals';
import { Router } from '@angular/router';

@Component({
  selector: 'an-add-sub',
  standalone: false,

  templateUrl: './add-sub.component.html',
  styleUrl: './add-sub.component.css'
})
export class AddSubComponent implements OnInit {
  amount: string = '';
  name: string = '';
  tempName: string = '';
  description: string = '';
  type: string = '';
  category: string = '';
  isAddButtonEnabled: boolean = false;
  currentState: { stateType: string; stateIntend: string } = { stateType: '', stateIntend: '' };

  setEnvironment(): void {
    this.entry = history.state.entry || null;
    console.log('Entry when entring add/edit: ', this.entry);
    if (this.entry) {
      this.currentState.stateType = this.entry.type;
      if (this.entry.name) {
        this.currentState.stateIntend = 'ändern';
        this.name = this.entry.name;
        this.tempName = this.entry.name;
        this.amount = this.entry.amount;
        this.type = this.entry.type;
        this.description = this.entry.description;
      } else {
        this.currentState.stateIntend = 'erstellen';
      }
    }
    switch (this.currentState.stateType) {
      case 'Einnahme':
        this.type = 'Einnahme';
        break;
      case 'Ausgabe':
        this.type = 'Ausgabe';
        break;
      default:
        this.router.navigate(['/home'])
    }
  }

  flushForm(): void {
    this.amount = '';
    this.name = '';
    this.description = '';
    this.type = '';
    this.category = '';
    this.isAddButtonEnabled = false;
  }

  constructor(private http: HttpClient, private router: Router) { }

  entry!: { name: string; amount: string; type: string; category: string; description: string };

  ngOnInit(): void {
    this.setEnvironment();
  }

  validateAddButton(): void {
    this.isAddButtonEnabled = !!this.name && parseFloat(this.amount) > 0 && !!this.type && !!localStorage.getItem('myToken')
  }

  addEntry(): void {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    console.log(this.name, this.tempName);

    if (this.name != this.tempName && this.tempName != '') {
      const tokenName = {
        token: token,
        name: this.tempName
      };

      this.http.delete(`${config.apiUrl}/entries`, {
        body: tokenName,
      }).subscribe({
        next: (message) => {
          console.log('Entry deleted successfully:', message);
        },
        error: (err) => {
          console.error('Error deleting entry:', err);
        }
      });

    }
    const entryToPost = {
      token: token,
      entry: {
        name: this.name,
        amount: parseFloat(this.amount),
        type: this.type,
        category: this.category,
        description: this.description
      }
    }

    this.http.post(`${config.apiUrl}/entries`, entryToPost).subscribe({
      next: (response: any) => {
        console.log('Successfully posted entry', response);
        this.flushForm();
        this.navToHome();
      },
      error: (err) => {
        console.log('Posting entry failed', err);

      }
    })

  }

  getEntries(): void {
    var token = localStorage.getItem('myToken');
    if (!token) return;

    console.log(token);

    this.http.get(`${config.apiUrl}/entries?token=${token}`).subscribe({
      next: (data) => {
        console.log('Got the entries.', data)
      },
      error: (err) => {
        console.log('Could not get entries', err);
      }
    })
  }

  navToHome(): void {
    this.flushForm();
    this.router.navigate(['/home']);
  }
}
