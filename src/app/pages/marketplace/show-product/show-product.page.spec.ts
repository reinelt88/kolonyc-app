import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowProductPage } from './show-product.page';

describe('ShowProductPage', () => {
  let component: ShowProductPage;
  let fixture: ComponentFixture<ShowProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
