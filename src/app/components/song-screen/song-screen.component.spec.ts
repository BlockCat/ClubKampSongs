import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongScreenComponent } from './song-screen.component';

describe('SongScreenComponent', () => {
  let component: SongScreenComponent;
  let fixture: ComponentFixture<SongScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
