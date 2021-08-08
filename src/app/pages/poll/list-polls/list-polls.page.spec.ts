import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListPollsPage} from './list-polls.page';

describe('ListPollsPage', () => {
  let component: ListPollsPage;
  let fixture: ComponentFixture<ListPollsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPollsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPollsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
