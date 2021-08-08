import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PersonDetailsHelpPage} from './person-details-help.page';

describe('PersonDetailsHelpPage', () => {
  let component: PersonDetailsHelpPage;
  let fixture: ComponentFixture<PersonDetailsHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonDetailsHelpPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetailsHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
