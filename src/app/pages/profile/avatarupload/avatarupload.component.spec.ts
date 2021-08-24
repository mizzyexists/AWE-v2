import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvataruploadComponent } from './avatarupload.component';

describe('AvataruploadComponent', () => {
  let component: AvataruploadComponent;
  let fixture: ComponentFixture<AvataruploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvataruploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvataruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
