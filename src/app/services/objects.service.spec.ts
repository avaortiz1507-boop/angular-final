import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ObjectsService } from './objects.service';

describe('ObjectsService', () => {
  let service: ObjectsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ObjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should use PATCH for object updates to match the API contract', () => {
    const payload = {
      name: 'Updated item',
      data: { color: 'green', price: 99 },
    };

    service.update('123', payload).subscribe();

    const req = httpMock.expectOne('https://api.restful-api.dev/objects/123');
    expect(req.request.method).toBe('PATCH');
    req.flush(payload);
  });
});
