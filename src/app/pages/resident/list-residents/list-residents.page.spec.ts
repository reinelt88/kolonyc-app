import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListResidentsPage } from './list-residents.page';

describe('ListResidentsPage', () => {
  let component: ListResidentsPage;
  let fixture: ComponentFixture<ListResidentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListResidentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListResidentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
