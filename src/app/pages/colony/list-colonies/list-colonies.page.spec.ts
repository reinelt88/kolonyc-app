import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListColoniesPage} from './list-colonies.page';

describe('ListColoniesPage', () => {
  let component: ListColoniesPage;
  let fixture: ComponentFixture<ListColoniesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListColoniesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListColoniesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
