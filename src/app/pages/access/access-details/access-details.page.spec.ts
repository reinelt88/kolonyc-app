import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AccessDetailsPage} from './access-details.page';

describe('AccessDetailsPage', () => {
  let component: AccessDetailsPage;
  let fixture: ComponentFixture<AccessDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessDetailsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
