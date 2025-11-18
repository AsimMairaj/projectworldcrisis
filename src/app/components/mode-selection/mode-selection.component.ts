import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ModeService, Mode } from '../../services/mode.service';

@Component({
  selector: 'app-mode-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-out'))
    ]),
    trigger('slideIn', [
      state('void', style({
        transform: 'scale(0.9)',
        opacity: 0
      })),
      state('*', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      transition('void => *', animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
export class ModeSelectionComponent {
  isDialogOpen = false;
  isHovered = false;
  focusedModeIndex = 0;

  modes: Mode[] = [
    {
      id: 'all',
      name: 'Summary Overview',
      icon: '🌍',
      description: 'Overall summary outlook of all crisis situations',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'poverty',
      name: 'Poverty',
      icon: '💰',
      description: 'View countries affected by poverty and economic hardship',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'drought',
      name: 'Drought',
      icon: '🌵',
      description: 'Explore regions experiencing water scarcity and drought',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'conflict',
      name: 'Conflict',
      icon: '⚔️',
      description: 'Identify areas affected by war and armed conflicts',
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'famine',
      name: 'Famine',
      icon: '🌾',
      description: 'Discover countries facing food insecurity and famine',
      color: 'from-green-600 to-emerald-700'
    }
  ];

  constructor(private modeService: ModeService) {}

  get currentMode(): Mode {
    return this.modeService.getCurrentMode();
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  selectMode(mode: Mode) {
    this.modeService.setCurrentMode(mode);
    this.closeDialog();
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollTop = container.scrollTop;
    const itemHeight = 200; // Height of each mode item including margin
    const paddingTop = 200; // Top padding to center first item

    // Calculate which item is closest to center
    // We need to account for the padding and find which item is in the viewport center
    const adjustedScroll = scrollTop - paddingTop;
    const newIndex = Math.round(adjustedScroll / itemHeight);
    this.focusedModeIndex = Math.max(0, Math.min(newIndex, this.modes.length - 1));
  }

  getItemTransform(index: number): string {
    const diff = index - this.focusedModeIndex;
    const translateY = diff * 10; // Slight vertical offset
    const scale = 1 - Math.abs(diff) * 0.15; // Scale down non-focused items
    const rotateX = diff * 15; // 3D rotation effect

    return `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`;
  }

  getItemOpacity(index: number): number {
    const diff = Math.abs(index - this.focusedModeIndex);
    return Math.max(0.3, 1 - diff * 0.3);
  }

  scrollToMode(index: number) {
    this.focusedModeIndex = index;
    const container = document.querySelector('.mode-scroll-container');
    if (container) {
      const itemHeight = 200;
      const centerOffset = container.clientHeight / 2 - itemHeight / 2;
      container.scrollTo({
        top: index * itemHeight - centerOffset,
        behavior: 'smooth'
      });
    }
  }
}
