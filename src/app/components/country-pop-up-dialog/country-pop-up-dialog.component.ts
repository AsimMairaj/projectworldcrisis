import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import statsData from '../../../../stats/stats.json';

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
  health: any;
  education: any;
  water_sanitation: any;
  economy: any;
  humanitarian_needs: any;
  climate_vulnerability: any;
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
  imports: [CommonModule],
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
  private readonly scrollThreshold: number = 100; // Increase this value to reduce sensitivity

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
      { id: 'health', title: 'Health', data: this.countryData.health, severity: this.countryData.health.severity },
      { id: 'education', title: 'Education', data: this.countryData.education, severity: this.countryData.education.severity },
      { id: 'water_sanitation', title: 'Water & Sanitation', data: this.countryData.water_sanitation, severity: this.countryData.water_sanitation.severity },
      { id: 'economy', title: 'Economy', data: this.countryData.economy, severity: this.countryData.economy.severity },
      { id: 'humanitarian', title: 'Humanitarian Needs', data: this.countryData.humanitarian_needs, severity: this.countryData.humanitarian_needs.severity },
      { id: 'climate', title: 'Climate Vulnerability', data: this.countryData.climate_vulnerability, severity: this.countryData.climate_vulnerability.severity }
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
    if (severity >= 5) return 'bg-red-100/80';
    if (severity >= 4) return 'bg-orange-100/80';
    if (severity >= 3) return 'bg-yellow-100/80';
    if (severity >= 2) return 'bg-blue-100/80';
    return 'bg-green-100/80';
  }

  close(): void {
    this.closeDialog.emit();
  }
}
