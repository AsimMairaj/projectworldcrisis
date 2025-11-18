import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit, OnChanges {
  @Input() appCountUp: number = 0;
  @Input() duration: number = 2000; // Duration in milliseconds
  @Input() suffix: string = ''; // For %, km², etc.
  @Input() shouldAnimate: boolean = false; // Control when to animate

  private animationFrameId?: number;
  private hasAnimated: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Set initial value to 0 or the actual value if not animating
    if (this.shouldAnimate) {
      this.el.nativeElement.textContent = '0' + this.suffix;
    } else {
      this.setFinalValue();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger animation when shouldAnimate changes to true
    if (changes['shouldAnimate'] && changes['shouldAnimate'].currentValue === true && !this.hasAnimated) {
      this.hasAnimated = true;
      this.animateCount(0, this.appCountUp);
    }

    // Handle value changes
    if (changes['appCountUp'] && !changes['appCountUp'].firstChange && this.hasAnimated) {
      const previousValue = changes['appCountUp'].previousValue || 0;
      this.animateCount(previousValue, this.appCountUp);
    }
  }

  private animateCount(start: number, end: number): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const element = this.el.nativeElement;
    const startTime = performance.now();
    const difference = end - start;

    // Add shake animation class
    element.classList.add('animate-count-up');

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = start + (difference * easeOutQuart);

      // Format the number
      const displayValue = this.formatNumber(currentValue, progress === 1);

      element.textContent = displayValue + this.suffix;

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Remove shake animation class when done
        setTimeout(() => {
          element.classList.remove('animate-count-up');
        }, 600); // Match the animation duration in CSS
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private formatNumber(value: number, isFinal: boolean): string {
    if (isFinal) {
      // For final value, use proper formatting
      if (Number.isInteger(this.appCountUp)) {
        return Math.round(value).toLocaleString();
      } else {
        // Preserve decimal places for non-integers
        const decimalPlaces = this.appCountUp.toString().split('.')[1]?.length || 0;
        return value.toFixed(decimalPlaces);
      }
    } else {
      // During animation, show integers for whole numbers
      if (Number.isInteger(this.appCountUp)) {
        return Math.round(value).toLocaleString();
      } else {
        return value.toFixed(1);
      }
    }
  }

  private setFinalValue(): void {
    const displayValue = this.formatNumber(this.appCountUp, true);
    this.el.nativeElement.textContent = displayValue + this.suffix;
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
