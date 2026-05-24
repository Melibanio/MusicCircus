import {
  Component,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  /* ── ACCORDION ──────────────────────────────────────── */
  openIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  /* ── FORMULÁRIO ─────────────────────────────────────── */
  nome  = '';
  email = '';
  msg   = '';

  nomeError  = '';
  emailError = '';
  msgError   = '';

  feedbackVisible = false;

  private validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  submitForm(): void {
    /* limpa estado anterior */
    this.nomeError  = '';
    this.emailError = '';
    this.msgError   = '';
    this.feedbackVisible = false;

    let valid = true;

    if (!this.nome.trim()) {
      this.nomeError = 'Por favor, informe seu nome.';
      valid = false;
    }
    if (!this.email.trim()) {
      this.emailError = 'Por favor, informe seu e-mail.';
      valid = false;
    } else if (!this.validateEmail(this.email.trim())) {
      this.emailError = 'E-mail inválido.';
      valid = false;
    }
    if (!this.msg.trim()) {
      this.msgError = 'A mensagem não pode ficar em branco.';
      valid = false;
    }

    if (valid) {
      this.nome  = '';
      this.email = '';
      this.msg   = '';
      this.feedbackVisible = true;

      /* scroll suave até o feedback */
      setTimeout(() => {
        const el = document.getElementById('feedback');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 0);
    }
  }

  /* ── REVEAL ON SCROLL ───────────────────────────────── */
  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll<HTMLElement>('.reveal').forEach((el, i) => {
      el.style.transitionDelay = i * 0.07 + 's';
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}