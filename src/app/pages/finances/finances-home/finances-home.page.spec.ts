import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinancesHomePage } from './finances-home.page';

describe('FinancesHomePage', () => {
  let component: FinancesHomePage;
  let fixture: ComponentFixture<FinancesHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancesHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
