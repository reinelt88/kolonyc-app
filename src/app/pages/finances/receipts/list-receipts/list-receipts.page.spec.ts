import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListReceiptsPage } from './list-receipts.page';

describe('ListReceiptsPage', () => {
  let component: ListReceiptsPage;
  let fixture: ComponentFixture<ListReceiptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReceiptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListReceiptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
