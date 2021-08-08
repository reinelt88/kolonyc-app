import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ListAccessTypesPage} from './list-access-types.page';

describe('ListAccessTypesPage', () => {
  let component: ListAccessTypesPage;
  let fixture: ComponentFixture<ListAccessTypesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListAccessTypesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAccessTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
