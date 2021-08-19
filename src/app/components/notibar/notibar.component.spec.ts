import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotibarComponent } from './notibar.component';

describe('NotibarComponent', () => {
  let component: NotibarComponent;
  let fixture: ComponentFixture<NotibarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotibarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotibarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
