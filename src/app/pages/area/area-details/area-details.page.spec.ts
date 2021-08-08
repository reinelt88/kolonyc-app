import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AreaDetailsPage} from './area-details.page';

describe('AreaDetailsPage', () => {
  let component: AreaDetailsPage;
  let fixture: ComponentFixture<AreaDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreaDetailsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
