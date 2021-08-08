import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListBookingsPage} from './list-bookings.page';

describe('ListBookingsPage', () => {
  let component: ListBookingsPage;
  let fixture: ComponentFixture<ListBookingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookingsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
