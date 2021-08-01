import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListMarketplaceCategoriesPage } from './list-marketplace-categories.page';

describe('ListMarketplaceCategoriesPage', () => {
  let component: ListMarketplaceCategoriesPage;
  let fixture: ComponentFixture<ListMarketplaceCategoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMarketplaceCategoriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListMarketplaceCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
