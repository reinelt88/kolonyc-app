import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AccessTypeDetailsPage} from './access-type-details.page';

describe('AccessTypeDetailsPage', () => {
  let component: AccessTypeDetailsPage;
  let fixture: ComponentFixture<AccessTypeDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessTypeDetailsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessTypeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
