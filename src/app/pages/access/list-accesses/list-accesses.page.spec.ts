import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListAccessesPage} from './list-accesses.page';

describe('ListAccessesPage', () => {
  let component: ListAccessesPage;
  let fixture: ComponentFixture<ListAccessesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListAccessesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAccessesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
