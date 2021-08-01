import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListProductsPage } from './list-products.page';

describe('ListProductsPage', () => {
  let component: ListProductsPage;
  let fixture: ComponentFixture<ListProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
