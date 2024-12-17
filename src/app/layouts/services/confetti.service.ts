import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti'

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  // Trigger basic confetti burst
  launchConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  // Customizable confetti burst
  customConfetti(options: confetti.Options): void {
    confetti(options);
  }

  launchSideConfetti(): void {
    const duration = 5 * 1000; // Confetti duration: 5 seconds
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 20,
        angle: 90,
        spread: 100,
        origin: { x: 0, y: 1 }, // Bottom-left
      });

      confetti({
        particleCount: 20,
        angle: 90,
        spread: 100,
        origin: { x: 1, y: 1 }, // Bottom-right
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }
}
