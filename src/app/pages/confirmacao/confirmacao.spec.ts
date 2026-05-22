import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmacao } from './confirmacao';

describe('Confirmacao', () => {
  let component: Confirmacao;
  let fixture: ComponentFixture<Confirmacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmacao],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
