import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'an-pie-chart',
  standalone: false,
  template: `<canvas #chartCanvas></canvas>`,
  styles: [':host { display: block; width: 100%; }']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvasRef!: ElementRef;
  @Input() chartData: { labels: string[]; datasets: any[] } = { labels: [], datasets: [] };

  chart!: Chart;

  ngOnInit(): void {
    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: this.chartData,
    });
  }
}
