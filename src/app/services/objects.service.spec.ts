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

  it('should fall back to creating a new object when the API rejects an update for a reserved id', () => {
    const payload = {
      name: 'Updated item',
      data: { color: 'green', price: 99 },
    };

    service.update('1', payload).subscribe((item) => {
      expect(item.name).toBe('Updated item');
    });

    const updateReq = httpMock.expectOne('https://api.restful-api.dev/objects/1');
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush(
      { error: '1 is a reserved id and the data object of it cannot be overridden.' },
      { status: 405, statusText: 'Method Not Allowed' },
    );

    const createReq = httpMock.expectOne('https://api.restful-api.dev/objects');
    expect(createReq.request.method).toBe('POST');
    createReq.flush({ id: 'new-123', name: 'Updated item', data: { color: 'green', price: 99 } });
  });
});
