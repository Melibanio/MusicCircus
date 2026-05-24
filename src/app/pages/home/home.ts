import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

// ─── Interfaces de dados ───────────────────────────────────────────────────────

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  precoOriginal: number;
  desconto: string;
  imagem: string;
}

export interface Curso {
  titulo: string;
  imagem: string;
  link: string;
}

export interface Categoria {
  tipo: string;
  nome: string;
  imagem: string;
}

// ─── Componente ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // ── Referências ao carrossel ──────────────────────────────────────────────
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLElement>;

  // ── Estado do carrossel ───────────────────────────────────────────────────
  private readonly visibleCards = 3;
  private carouselIndex = this.visibleCards;
  private originalLength = 0;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

  // ── Formulário de contato ────────────────────────────────────────────────
  contatoNome = '';
  contatoEmail = '';
  contatoTelefone = '';
  contatoMensagem = '';

  // ── Dados: Categorias ────────────────────────────────────────────────────
  categorias: Categoria[] = [
    { tipo: 'Instrumentos', nome: 'De Sopro',   imagem: '/public/IMG/sopro.png'      },
    { tipo: 'Instrumentos', nome: 'De Cordas',  imagem: '/public/IMG/cordas.jpg'     },
    { tipo: 'Instrumentos', nome: 'Percussão',  imagem: '/public/IMG/percussão.jpg'  },
  ];

  // ── Dados: Produtos ───────────────────────────────────────────────────────
  produtos: Produto[] = [
    { id: 1, nome: 'Violão Elétrico Nylon Strinberg Flat SL200C MGS',                     preco: 585.00,   precoOriginal: 650.00,   desconto: '-10%', imagem: '/public/IMG/violão1.jpeg'   },
    { id: 2, nome: 'Flauta Doce Tenor Yamaha Barroca YRT 304B II',                         preco: 702.90,   precoOriginal: 780.90,   desconto: '-10%', imagem: '/public/IMG/flauta1.jpeg'   },
    { id: 3, nome: 'Guitarra Super Stratocaster Seizi Fun Budokan Vintage Daphne Blue',    preco: 1341.90,  precoOriginal: 1490.90,  desconto: '-10%', imagem: '/public/IMG/guitarra1.jpeg' },
    { id: 4, nome: 'Violino 4/4 Vivace Mozart MO44S Fosco',                                preco: 585.00,   precoOriginal: 650.00,   desconto: '-10%', imagem: '/public/IMG/violino1.jpeg'  },
    { id: 5, nome: 'Saxofone Tenor Eagle ST 503',                                           preco: 7609.95,  precoOriginal: 8455.50,  desconto: '-10%', imagem: '/public/IMG/saxofone1.jpeg' },
    { id: 6, nome: 'Pandeiro 11" Contemporânea Fórmica Black Carlos Café 37PBCF',          preco: 769.50,   precoOriginal: 855.00,   desconto: '-10%', imagem: '/public/IMG/pandeiro1.jpeg' },
    { id: 7, nome: 'Bateria eletrônica 7 Pads MXT MD200C',                                 preco: 2097.00,  precoOriginal: 2330.00,  desconto: '-10%', imagem: '/public/IMG/bateria1.jpeg'  },
    { id: 8, nome: 'Asalato Tac Iniciante (1 Par)',                                         preco: 117.00,   precoOriginal: 130.00,   desconto: '-10%', imagem: '/public/IMG/assalato1.jpeg' },
    { id: 9, nome: 'Gaita Diatônica Orleans Stone G Sol',                                   preco: 135.00,   precoOriginal: 150.00,   desconto: '-10%', imagem: '/public/IMG/gaita1.jpeg'    },
  ];

  // ── Dados: Cursos ─────────────────────────────────────────────────────────
  cursos: Curso[] = [
    { titulo: 'Aulas de Bateria',  imagem: '/public/IMG/bateria.jpg',      link: 'https://www.schoolofrock.com.br/' },
    { titulo: 'Aulas de Guitarra', imagem: '/public/IMG/guitar.jpg',       link: 'https://addmusica.com/'           },
    { titulo: 'Aulas de Piano',    imagem: '/public/IMG/piano.jpg',        link: 'https://pianobello.com/'          },
    { titulo: 'Aulas de Violino',  imagem: '/public/IMG/violino.jpg',      link: 'https://companhiadascordas.com.br/violino/' },
    { titulo: 'Aulas de Saxofone', imagem: '/public/IMG/Blog-1024x683.jpg',link: 'https://studiolatitude.com.br/'  },
    { titulo: 'Aulas de Flauta',   imagem: '/public/IMG/flauta.jpg',       link: 'https://companhiadascordas.com.br/violino/' },
  ];

  // ── Dados para renderização do carrossel (inclui clones) ──────────────────
  cursosCarrossel: Curso[] = [];

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildCarouselData();
  }

  ngAfterViewInit(): void {
    // Aguarda o DOM renderizar os cards clonados
    setTimeout(() => {
      this.updateCarouselPosition(false);
      this.startAutoPlay();
    }, 50);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // ── Carrossel ─────────────────────────────────────────────────────────────

  /**
   * Monta o array com clones no início e no fim para o loop infinito.
   * Equivalente ao setupCarousel() do carousel.js original.
   */
  private buildCarouselData(): void {
    this.originalLength = this.cursos.length;

    const clonesStart = this.cursos.slice(-this.visibleCards);
    const clonesEnd   = this.cursos.slice(0, this.visibleCards);

    this.cursosCarrossel = [...clonesStart, ...this.cursos, ...clonesEnd];
    this.carouselIndex = this.visibleCards;
  }

  /** Calcula a largura de um card (280px) + gap (10px) = 290px */
  private getCardWidth(): number {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return 290;
    const firstCard = track.querySelector('.card') as HTMLElement | null;
    return firstCard ? firstCard.offsetWidth + 10 : 290;
  }

  /** Aplica o transform ao track, com ou sem animação */
  private updateCarouselPosition(animate = true): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return;

    track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform  = `translateX(-${this.carouselIndex * this.getCardWidth()}px)`;
  }

  /**
   * Verifica se chegou nos extremos e reposiciona sem animação.
   * Equivalente ao checkLoop() do carousel.js original.
   */
  private checkLoop(): void {
    if (this.carouselIndex >= this.originalLength + this.visibleCards) {
      this.carouselIndex = this.visibleCards;
      this.updateCarouselPosition(false);
    } else if (this.carouselIndex < this.visibleCards) {
      this.carouselIndex = this.originalLength + this.visibleCards - 1;
      this.updateCarouselPosition(false);
    }
  }

  /** Avança um card */
  carouselNext(): void {
    this.carouselIndex++;
    this.updateCarouselPosition();

    const track = this.carouselTrack?.nativeElement;
    track?.addEventListener('transitionend', () => this.checkLoop(), { once: true });
  }

  /** Recua um card */
  carouselPrev(): void {
    this.carouselIndex--;
    this.updateCarouselPosition();

    const track = this.carouselTrack?.nativeElement;
    track?.addEventListener('transitionend', () => this.checkLoop(), { once: true });
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => this.carouselNext(), 3000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // ── Carrinho (stub — integrar com CartService) ────────────────────────────

  addToCart(produto: Produto): void {
    // TODO: injetar CartService e chamar cartService.add(produto)
    console.log('Adicionado ao carrinho:', produto.nome);
    alert(`"${produto.nome}" adicionado ao carrinho!`);
  }

  // ── Formulário de contato ─────────────────────────────────────────────────

  onContatoSubmit(): void {
    if (!this.contatoNome || !this.contatoEmail || !this.contatoMensagem) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }
    // TODO: integrar com serviço de envio de e-mail ou API
    console.log('Mensagem enviada:', {
      nome:      this.contatoNome,
      email:     this.contatoEmail,
      telefone:  this.contatoTelefone,
      mensagem:  this.contatoMensagem,
    });
    alert('Mensagem enviada com sucesso!');
    this.contatoNome = this.contatoEmail = this.contatoTelefone = this.contatoMensagem = '';
  }

  // ── Utilitários ───────────────────────────────────────────────────────────

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}