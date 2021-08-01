import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSwitchPage } from './user-switch.page';

describe('UserSwitchPage', () => {
  let component: UserSwitchPage;
  let fixture: ComponentFixture<UserSwitchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSwitchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSwitchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
