import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import statsData from '/Users/asim/Desktop/projectglobal/projectworldcrisis/public/stats/stats.json';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CountUpDirective } from './count-up.directive';

interface CountryData {
  country: string;
  iso_a3: string;
  capital: string;
  population: number;
  area_km2: number;
  region: string;
  poverty: any;
  hunger: any;
  conflict: any;
  drought: any;
  crisis_summary: string;
  last_updated: string;
}

interface CardInfo {
  id: string;
  title: string;
  data: any;
  severity: number;
}

@Component({
  selector: 'app-country-pop-up-dialog',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  templateUrl: './country-pop-up-dialog.component.html',
  styleUrls: ['./country-pop-up-dialog.component.css']
})
export class CountryPopUpDialogComponent implements OnInit, AfterViewInit {
  @Input() countryName?: string;
  @Output() closeDialog = new EventEmitter<void>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  countryData: CountryData | null = null;
  flagCode: string = '';
  currentCardIndex: number = 0;
  cards: CardInfo[] = [];

  // Scroll sensitivity control
  private scrollAccumulator: number = 0;
  private readonly scrollThreshold: number = 200; // Increase this value to reduce sensitivity

  ngOnInit(): void {
    this.loadCountryData();
  }

  ngAfterViewInit(): void {
    // Initialize scroll position
    setTimeout(() => {
      this.scrollToCard(0);
    }, 100);
  }

  loadCountryData(): void {
    const countries = statsData as CountryData[];

    if (this.countryName) {
      this.countryData = countries.find(
        c => c.country.toLowerCase() === this.countryName!.toLowerCase()
      ) || null;
    }

    if (!this.countryData && countries.length > 0) {
      const randomIndex = Math.floor(Math.random() * countries.length);
      this.countryData = countries[randomIndex];
    }

    if (this.countryData) {
      this.flagCode = this.getISO2Code(this.countryData.iso_a3);
      this.initializeCards();
    }
  }

  initializeCards(): void {
    if (!this.countryData) return;

    this.cards = [
      { id: 'poverty', title: 'Poverty', data: this.countryData.poverty, severity: this.countryData.poverty.severity },
      { id: 'hunger', title: 'Hunger', data: this.countryData.hunger, severity: this.countryData.hunger.severity },
      { id: 'conflict', title: 'Conflict', data: this.countryData.conflict, severity: this.countryData.conflict.severity },
      { id: 'drought', title: 'Drought & Water', data: this.countryData.drought, severity: this.countryData.drought.severity },
    ];
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    event.preventDefault();

    // Accumulate scroll delta
    this.scrollAccumulator += event.deltaY;

    // Check if accumulated scroll exceeds threshold
    if (Math.abs(this.scrollAccumulator) >= this.scrollThreshold) {
      if (this.scrollAccumulator > 0 && this.currentCardIndex < this.cards.length - 1) {
        // Scroll down
        this.currentCardIndex++;
        this.scrollToCard(this.currentCardIndex);
        this.scrollAccumulator = 0; // Reset accumulator
      } else if (this.scrollAccumulator < 0 && this.currentCardIndex > 0) {
        // Scroll up
        this.currentCardIndex--;
        this.scrollToCard(this.currentCardIndex);
        this.scrollAccumulator = 0; // Reset accumulator
      } else {
        // Reset if at boundaries
        this.scrollAccumulator = 0;
      }
    }
  }

  scrollToCard(index: number): void {
    this.currentCardIndex = index;
    const container = this.scrollContainer?.nativeElement;
    if (container) {
      const card = container.querySelector(`#card-${index}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  goToCard(index: number): void {
    this.scrollToCard(index);
  }

  getISO2Code(iso3: string): string {
    const iso3ToIso2: { [key: string]: string } = {
      'SDN': 'sd', 'AFG': 'af', 'YEM': 'ye', 'SYR': 'sy', 'SOM': 'so', 'ETH': 'et',
      'COD': 'cd', 'CAF': 'cf', 'TCD': 'td', 'NER': 'ne', 'MLI': 'ml', 'BFA': 'bf',
      'NGA': 'ng', 'HTI': 'ht', 'VEN': 've', 'PAK': 'pk', 'BGD': 'bd', 'MMR': 'mm',
      'IRQ': 'iq', 'LBY': 'ly', 'UKR': 'ua', 'ZWE': 'zw', 'MOZ': 'mz', 'MDG': 'mg',
      'KEN': 'ke', 'UGA': 'ug', 'TZA': 'tz', 'CMR': 'cm', 'SSD': 'ss', 'ERI': 'er',
      'DJI': 'dj', 'BDI': 'bi', 'RWA': 'rw', 'SLE': 'sl', 'LBR': 'lr', 'GIN': 'gn',
      'CIV': 'ci', 'GHA': 'gh', 'BEN': 'bj', 'TGO': 'tg', 'SEN': 'sn', 'GMB': 'gm',
      'GNB': 'gw', 'MRT': 'mr', 'DZA': 'dz', 'TUN': 'tn', 'MAR': 'ma', 'EGY': 'eg',
      'SAU': 'sa', 'JOR': 'jo', 'LBN': 'lb', 'PSE': 'ps', 'ISR': 'il', 'TUR': 'tr',
      'IRN': 'ir', 'IND': 'in', 'NPL': 'np', 'LKA': 'lk', 'KHM': 'kh', 'LAO': 'la',
      'VNM': 'vn', 'PHL': 'ph', 'IDN': 'id', 'PNG': 'pg', 'SLB': 'sb', 'VUT': 'vu',
      'FJI': 'fj', 'TLS': 'tl', 'MNG': 'mn', 'PRK': 'kp', 'CHN': 'cn', 'USA': 'us',
      'CAN': 'ca', 'MEX': 'mx', 'GTM': 'gt', 'HND': 'hn', 'SLV': 'sv', 'NIC': 'ni',
      'CRI': 'cr', 'PAN': 'pa', 'COL': 'co', 'ECU': 'ec', 'PER': 'pe', 'BOL': 'bo',
      'PRY': 'py', 'CHL': 'cl', 'ARG': 'ar', 'URY': 'uy', 'BRA': 'br', 'GUY': 'gy',
      'SUR': 'sr', 'GUF': 'gf'
    };

    return iso3ToIso2[iso3] || iso3.toLowerCase().substring(0, 2);
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  getSeverityBackgroundClass(severity: number): string {
    // Return gradient classes based on severity
    if (severity >= 5) return 'bg-gradient-to-br from-red-200/90 via-red-100/85 to-orange-100/80';
    if (severity >= 4) return 'bg-gradient-to-br from-orange-200/90 via-orange-100/85 to-yellow-100/80';
    if (severity >= 3) return 'bg-gradient-to-br from-yellow-200/90 via-yellow-100/85 to-amber-100/80';
    if (severity >= 2) return 'bg-gradient-to-br from-blue-200/90 via-blue-100/85 to-cyan-100/80';
    return 'bg-gradient-to-br from-green-200/90 via-green-100/85 to-emerald-100/80';
  }

  getSeverityLabel(severity: number): string {
    if (severity >= 5) return 'Critical';
    if (severity >= 4) return 'Severe';
    if (severity >= 3) return 'High';
    if (severity >= 2) return 'Moderate';
    return 'Low';
  }

  getSeverityChipClass(severity: number): string {
    if (severity >= 5) return 'bg-red-600 text-white';
    if (severity >= 4) return 'bg-orange-600 text-white';
    if (severity >= 3) return 'bg-yellow-600 text-white';
    if (severity >= 2) return 'bg-blue-600 text-white';
    return 'bg-green-600 text-white';
  }

  getSeverityGradientClass(severity: number): string {
    if (severity >= 5) return 'text-gradient-red';
    if (severity >= 4) return 'text-gradient-orange';
    if (severity >= 3) return 'text-gradient-yellow';
    if (severity >= 2) return 'text-gradient-blue';
    return 'text-gradient-green';
  }

  close(): void {
    this.closeDialog.emit();
  }
}
