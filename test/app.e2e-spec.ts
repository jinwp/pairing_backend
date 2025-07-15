import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { io, Socket } from 'socket.io-client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(3001);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach((done) => {
    socket = io('http://localhost:3001');
    socket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    socket.disconnect();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should handle message event', (done) => {
    const message = 'Hello from client';
    socket.emit('message', message);

    socket.once('message', (response) => {
      expect(response).toBe(message);
      done();
    });
  });
});
