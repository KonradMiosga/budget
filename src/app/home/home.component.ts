import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { config } from '../../globals';
import { Router } from '@angular/router';

@Component({
  selector: 'an-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  @ViewChild('chartEinzahlung', { static: false }) chartEinzahlungRef!: ElementRef;
  @ViewChild('chartAuszahlung', { static: false }) chartAuszahlungRef!: ElementRef;
  @ViewChild('chartRest', { static: false }) chartRestRef!: ElementRef;
  chartEinzahlung!: Chart;
  chartAuszahlung!: Chart;
  chartRest!: Chart;

  dataInput: { name: string; amount: number; type: string; description: string }[] = [];
  einzahlungData: { name: string; amount: number; type: string; description: string; isHovered: boolean }[] = [];
  auszahlungData: { name: string; amount: number; type: string; description: string; isHovered: boolean }[] = [];
  einzahlungTotal: number = 0;
  auszahlungTotal: number = 0;
  summeTotal: number = 0;

  exampleData = [{
    name: "Bsp.-Gehalt",
    amount: 2000,
    type: "Einnahme",
    description: ""
  }, {
    name: "Bsp.-Nebenjob",
    amount: 400,
    type: "Einnahme",
    description: ""
  }, {
    name: "Bsp.-Taschengeld",
    amount: 50,
    type: "Einnahme",
    description: ""
  }, {
    name: "Bsp.-Miete",
    amount: 600,
    type: "Ausgabe",
    description: ""
  }, {
    name: "Bsp.-Netflix",
    amount: 10,
    type: "Ausgabe",
    description: ""
  }, {
    name: "Bsp.-Versicherung",
    amount: 50,
    type: "Ausgabe",
    description: ""
  }, {
    name: "Bsp.-Auto",
    amount: 250,
    type: "Ausgabe",
    description: ""
  }, {
    name: "Bsp.-Essen",
    amount: 300,
    type: "Ausgabe",
    description: ""
  }];

  hasToken: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    var token = localStorage.getItem('myToken');
    this.hasToken = !!token;
  }

  navToAddIncome(): void {
    const entry = {
      name: '',
      amount: '',
      type: 'Einnahme',
      category: '',
      description: '',
    };
    this.router.navigate(['/add'], { state: { entry } })
  }

  navToEdit(selectedEntry: { name: string; amount: number; type: string; description: string }): void {
    const entry = {
      name: selectedEntry.name,
      amount: selectedEntry.amount,
      type: selectedEntry.type,
      description: selectedEntry.description,
    };
    this.router.navigate(['/add'], { state: { entry } })
  }

  navToAddExpense(): void {
    const entry = {
      name: '',
      amount: '',
      type: 'Ausgabe',
      category: '',
      description: '',
    };
    this.router.navigate(['/add'], { state: { entry } })
  }

  ngAfterViewInit(): void {
    this.getData()
    this.createCharts()
  }

  populateSite(dataInput: { name: string; amount: number; type: string; description: string }[]): void {
    this.einzahlungData = dataInput.filter((entry) => entry.type === 'Einnahme').sort((a, b) => b.amount - a.amount).map((entry) => ({ ...entry, isHovered: false }));
    this.auszahlungData = dataInput.filter((entry) => entry.type === 'Ausgabe').sort((a, b) => b.amount - a.amount).map((entry) => ({ ...entry, isHovered: false }));

    this.einzahlungTotal = this.einzahlungData.reduce((sum, entry) => sum + entry.amount, 0);
    this.auszahlungTotal = this.auszahlungData.reduce((sum, entry) => sum + entry.amount, 0);

    this.summeTotal = this.einzahlungTotal - this.auszahlungTotal
  }

  getData(): void {
    var token = localStorage.getItem('myToken');
    if (!token) {
      this.dataInput = this.exampleData
      this.populateSite(this.dataInput)
      if (!this.chartEinzahlung || !this.chartAuszahlung) {
        this.createCharts();
      } else {
        this.updateCharts();
      }
    } else {
      this.http.get<{ name: string, amount: number, type: string, description: string }[]>(`${config.apiUrl}/entries?token=${token}`).subscribe({
        next: (values) => {
          console.log("Data loading complete", values)
          this.dataInput = values;
          this.populateSite(this.dataInput)
          if (!this.chartEinzahlung || !this.chartAuszahlung) {
            this.createCharts();
          } else {
            this.updateCharts();
          }
        },
        error: (err) => {
          console.log('Could not get data:', err);
        }
      })
    }
  }

  deleteEntry(data: { name: string; amount: number; type: string; isHovered: boolean }): void {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    const tokenName = {
      token: token,
      name: data.name
    };

    this.http.delete(`${config.apiUrl}/entries`, {
      body: tokenName,
    }).subscribe({
      next: (message) => {
        console.log('Entry deleted successfully:', message);
        this.getData();
        this.updateCharts();

      },
      error: (err) => {
        console.error('Error deleting entry:', err);
      }
    });
  }

  barColors = [
    '#b91d47',
    '#00aba9',
    '#2b5797',
    '#e8c3b9',
    '#1e7145',
    '#f0a500',
    '#f472d0',
    '#00a300',
  ];

  createCharts(): void {
    const einzahlLabels = this.einzahlungData.map(entry => entry.name);
    const auszahlLabels = this.auszahlungData.map(entry => entry.name);
    const einzahlValues = this.einzahlungData.map(entry => entry.amount);
    const auszahlValues = this.auszahlungData.map(entry => entry.amount);

    const ctx1 = this.chartEinzahlungRef.nativeElement.getContext('2d');
    this.chartEinzahlung = new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: einzahlLabels,
        datasets: [{
          backgroundColor: this.barColors,
          data: einzahlValues,
          hoverOffset: 10,
        }]
      }
    })

    const ctx2 = this.chartAuszahlungRef.nativeElement.getContext('2d');
    this.chartAuszahlung = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: auszahlLabels,
        datasets: [{
          backgroundColor: this.barColors,
          data: auszahlValues,
          hoverOffset: 10,
        }]
      }
    })

    const ctx3 = this.chartRestRef.nativeElement.getContext('2d');
    this.chartRest = new Chart(ctx3, {
      type: "pie",
      data: {
        labels: ["Ausgaben", "Überschuss"],
        datasets: [{
          backgroundColor: ["red", "yellow"],
          data: [this.auszahlungTotal, this.summeTotal],
          hoverOffset: 10
        }]
      }
    })
  }

  updateCharts(): void {
    if (this.chartEinzahlung) {
      this.chartEinzahlung.data.labels = this.einzahlungData.map(entry => entry.name);
      this.chartEinzahlung.data.datasets[0].data = this.einzahlungData.map(entry => entry.amount);
      this.chartEinzahlung.reset();
      this.chartEinzahlung.update();

      this.chartAuszahlung.data.labels = this.auszahlungData.map(entry => entry.name);
      this.chartAuszahlung.data.datasets[0].data = this.auszahlungData.map(entry => entry.amount);
      this.chartAuszahlung.reset();
      this.chartAuszahlung.update();

      if (this.auszahlungTotal == 0 && this.summeTotal == 0) {
        this.chartRest.data.labels = [];
      } else {
        this.chartRest.data.labels = ["Ausgaben", "Überschuss"];
      }
      this.chartRest.data.datasets[0].data = [this.auszahlungTotal, this.summeTotal];
      this.chartRest.reset();
      this.chartRest.update();
    }
  }
}

