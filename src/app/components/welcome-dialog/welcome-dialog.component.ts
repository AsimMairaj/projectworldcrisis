import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface AnimatedLine {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  targetX: number;
  targetY: number;
  targetRotation: number;
}

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('* => void', animate('500ms ease-out'))
    ])
  ]
})
export class WelcomeDialogComponent implements OnInit {
  isVisible = true;

  ngOnInit() { }

  startAnimation() { }

  close() {
    this.isVisible = false;
  }
}
