import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListUsersPage } from './list-users.page';

describe('ListUsersPage', () => {
  let component: ListUsersPage;
  let fixture: ComponentFixture<ListUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
