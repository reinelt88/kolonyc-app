import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentHomePage } from './payment-home.page';

describe('PaymentHomePage', () => {
  let component: PaymentHomePage;
  let fixture: ComponentFixture<PaymentHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
