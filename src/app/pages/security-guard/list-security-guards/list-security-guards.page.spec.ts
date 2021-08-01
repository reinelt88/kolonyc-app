import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListSecurityGuardsPage } from './list-security-guards.page';

describe('ListSecurityGuardsPage', () => {
  let component: ListSecurityGuardsPage;
  let fixture: ComponentFixture<ListSecurityGuardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSecurityGuardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSecurityGuardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
