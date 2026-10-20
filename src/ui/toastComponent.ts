export class ToastComponent {
  private element: HTMLElement;
  private timeoutId: number | null = null;

  constructor(containerId: string = 'game-toast') {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      el.className = 'game-toast';
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'assertive');
      document.body.appendChild(el);
    }
    this.element = el;
  }

  public show(message: string, durationMs: number = 2000): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.element.textContent = message;
    this.element.classList.add('visible');

    this.timeoutId = window.setTimeout(() => {
      this.element.classList.remove('visible');
      this.timeoutId = null;
    }, durationMs);
  }
}
