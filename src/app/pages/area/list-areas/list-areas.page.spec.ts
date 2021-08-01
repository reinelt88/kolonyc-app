import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListAreasPage } from './list-areas.page';

describe('ListAreasPage', () => {
  let component: ListAreasPage;
  let fixture: ComponentFixture<ListAreasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAreasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAreasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
