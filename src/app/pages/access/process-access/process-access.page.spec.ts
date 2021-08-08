import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ProcessAccessPage} from './process-access.page';

describe('ProcessAccessPage', () => {
  let component: ProcessAccessPage;
  let fixture: ComponentFixture<ProcessAccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessAccessPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
