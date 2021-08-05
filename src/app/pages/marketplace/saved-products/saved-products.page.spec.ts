import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavedProductsPage } from './saved-products.page';

describe('SavedProductsPage', () => {
  let component: SavedProductsPage;
  let fixture: ComponentFixture<SavedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
