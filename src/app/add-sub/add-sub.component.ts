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
  description: string = '';
  type: string = '';
  category: string = '';
  // isCategoryEnabled: boolean = false;
  isAddButtonEnabled: boolean = false;
  currentState: { stateType: string; stateIntend: string } = { stateType: '', stateIntend: '' };

  setEnvironment(): void {
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
    // this.isCategoryEnabled = false;
    this.isAddButtonEnabled = false;
  }


  // expenseCategories: string[] = [
  //   'Wohnen', 'Transport', 'Lebensmittel', 'Versicherung', 'Freizeit',
  //   'Sonstiges', 'Gesundheit', 'Bildung', 'Kredite/Schulden', 'Steuern',
  //   'Haushaltsgeräte', 'Kinderbetreuung', 'Geschenke/Spenden', 'Tierhaltung'
  // ];
  //
  // incomeCategories: string[] = [
  //   'Gehalt', 'Zinsen', 'Nebenjob', 'Mieteinnahmen', 'Rente/Pension',
  //   'Unterstützung', 'Bonuszahlungen', 'Gewinnbeteiligung', 'Investitionen',
  //   'Verkauf von Eigentum', 'Stipendien/Bildungsförderung'
  // ];


  constructor(private http: HttpClient, private router: Router) { }

  entry!: { name: string; amount: string; type: string; category: string; description: string };

  ngOnInit(): void {
    this.entry = history.state.entry || null;
    console.log('Entry when entring add/edit: ', this.entry);
    if (this.entry) {
      this.currentState.stateType = this.entry.type;
      if (this.entry.name) {
        this.currentState.stateIntend = 'ändern';
        this.name = this.entry.name;
        this.amount = this.entry.amount;
        this.type = this.entry.type;
        this.description = this.entry.description;
      } else {
        this.currentState.stateIntend = 'erstellen';
      }
    }

    this.setEnvironment();


  }

  // onTypeChange(): void {
  //   this.isCategoryEnabled = !!this.type;
  //   if (!this.isCategoryEnabled) {
  //     this.category = '';
  //   }
  // }

  validateAddButton(): void {
    this.isAddButtonEnabled = !!this.name && parseFloat(this.amount) > 0 && !!this.type && !!localStorage.getItem('myToken')
  }

  addEntry(): void {
    console.log("Clickin' da button");
    var token = localStorage.getItem('myToken');
    if (!token) return;
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
        alert('Great success!');
        this.flushForm()
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
