import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors();   // 다른 도메인에서 너의 API 서버에 요청할 수 있도록 허용

  // Swagger 초기화
  const config = new DocumentBuilder()
    .setTitle('Pairing App API')
    .setDescription('The Pairing App API description')
    .setVersion('1.0')
    .addTag('pairing')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI를 통해 API 문서를 제공
  // SwaggerModule은 NestJS에서 API 문서를 자동으로 생성해주는 모듈

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
}

bootstrap();
