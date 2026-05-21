import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recuperar } from './recuperar';

describe('Recuperar', () => {
  let component: Recuperar;
  let fixture: ComponentFixture<Recuperar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recuperar],
    }).compileComponents();

    fixture = TestBed.createComponent(Recuperar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
