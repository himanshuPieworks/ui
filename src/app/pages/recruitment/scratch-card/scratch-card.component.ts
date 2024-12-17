import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-scratch-card',
  templateUrl: './scratch-card.component.html',
  styleUrls: ['./scratch-card.component.scss'],
})
export class ScratchCardComponent implements AfterViewInit {
  @ViewChild('scratchCanvas', { static: true }) canvasRef!: ElementRef;
  @Input() prizeMessage: string = 'Congratulations! You unlocked the prize!';
  @Input() imageForwardSrc: string = 'assets/images/we.png';
  @Output() scratchCompleted = new EventEmitter<void>();

  isScratchedEnough = false;
  private ctx!: CanvasRenderingContext2D;
  private canvasWidth = 300; // Adjust as needed
  private canvasHeight = 200; // Adjust as needed
  private clearPercentage = 50; // Trigger event when this percentage is revealed

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    const scratchImage = new Image();
    scratchImage.src = this.imageForwardSrc;

    scratchImage.onload = () => {
      this.ctx.drawImage(scratchImage, 0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.globalCompositeOperation = 'destination-out';
    };

    this.setupCanvasListeners(canvas);
  }

  setupCanvasListeners(canvas: HTMLCanvasElement) {
    let isDrawing = false;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      this.scratch(e, canvas);
    };

    const stopDrawing = () => {
      isDrawing = false;
      if (this.getClearPercentage() > this.clearPercentage) {
        this.isScratchedEnough = true;
        this.scratchCompleted.emit(); // Notify parent component
      }
    };

    const continueDrawing = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      this.scratch(e, canvas);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', continueDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', continueDrawing);
  }

  scratch(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  getClearPercentage(): number {
    const imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    const pixels = imageData.data;
    const totalPixels = pixels.length / 4;

    let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) clearPixels++;
    }

    return (clearPixels / totalPixels) * 100;
  }
}
