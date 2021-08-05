import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListChatsPage } from './list-chats.page';

describe('ListChatsPage', () => {
  let component: ListChatsPage;
  let fixture: ComponentFixture<ListChatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListChatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
