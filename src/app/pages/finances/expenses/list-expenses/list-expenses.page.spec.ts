import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListExpensesPage } from './list-expenses.page';

describe('ListExpensesPage', () => {
  let component: ListExpensesPage;
  let fixture: ComponentFixture<ListExpensesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExpensesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListExpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
