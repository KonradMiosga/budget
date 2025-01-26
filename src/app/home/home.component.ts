import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { config } from '../../globals';

@Component({
  selector: 'an-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  @ViewChild('chartEinzahlung', { static: false }) chartEinzahlung!: ElementRef;
  @ViewChild('chartAuszahlung', { static: false }) chartAuszahlung!: ElementRef;
  dataInput: { name: string; amount: number; type: string }[] = [];
  einzahlungData: { name: string; amount: number; type: string }[] = [];
  auszahlungData: { name: string; amount: number; type: string }[] = [];
  einzahlungTotal: number = 0;
  auszahlungTotal: number = 0;
  summeTotal: number = 0;
  exampleData = [{
    name: "Bsp.-Gehalt",
    amount: 2000,
    type: "Einnahme"
  }, {
    name: "Bsp.-Nebenjob",
    amount: 400,
    type: "Einnahme"
  }, {
    name: "Bsp.-Taschengeld",
    amount: 50,
    type: "Einnahme"
  }, {
    name: "Bsp.-Miete",
    amount: 600,
    type: "Ausgabe"
  }, {
    name: "Bsp.-Netflix",
    amount: 10,
    type: "Ausgabe"
  }, {
    name: "Bsp.-Versicherung",
    amount: 50,
    type: "Ausgabe"
  }, {
    name: "Bsp.-Auto",
    amount: 250,
    type: "Ausgabe"
  }, {
    name: "Bsp.-Essen",
    amount: 300,
    type: "Ausgabe"
  }];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // var token = localStorage.getItem('myToken');
    // if (!token) {
    //   this.populateSite(this.exampleData)
    // } else {
    //   this.getData()
    // }
  }

  ngAfterViewInit(): void {
    this.getData()
  }

  //Ich habe nie etwas schöneres gesehen =)
  populateSite(dataInput: { name: string; amount: number; type: string; }[]): void {
    this.einzahlungData = dataInput.filter((entry) => entry.type === 'Einnahme');
    this.auszahlungData = dataInput.filter((entry) => entry.type === 'Ausgabe');

    this.einzahlungTotal = this.einzahlungData.reduce((sum, entry) => sum + entry.amount, 0);
    this.auszahlungTotal = this.auszahlungData.reduce((sum, entry) => sum + entry.amount, 0);

    this.summeTotal = this.einzahlungTotal - this.auszahlungTotal
  }

  getData(): void {
    var token = localStorage.getItem('myToken');
    if (!token) {
      this.dataInput = this.exampleData
      this.populateSite(this.dataInput)
      this.createCharts()
    } else {
      this.http.get<{ name: string, amount: number, type: string }[]>(`${config.apiUrl}/entries?token=${token}`).subscribe({
        next: (values) => {
          console.log("Data loading complete", values)
          this.dataInput = values;
          this.populateSite(this.dataInput)
          this.createCharts()
        },
        error: (err) => {
          console.log('Could not get data:', err);
        }
      })
    }
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
    const einzahlLabels = this.einzahlungData.sort((a, b) => b.amount - a.amount).map(entry => entry.name);
    const auszahlLabels = this.auszahlungData.sort((a, b) => b.amount - a.amount).map(entry => entry.name);
    const einzahlValues = this.einzahlungData.sort((a, b) => b.amount - a.amount).map(entry => entry.amount);
    const auszahlValues = this.auszahlungData.sort((a, b) => b.amount - a.amount).map(entry => entry.amount);

    console.log(einzahlLabels);

    new Chart(this.chartEinzahlung.nativeElement, {
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

    new Chart(this.chartAuszahlung.nativeElement, {
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
  }

}
