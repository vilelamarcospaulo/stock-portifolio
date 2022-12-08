import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Portfolio Handler')
    .setDescription('Portfolio Handler API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();

// > POSITIONS
//   >> DEL => AMOUNT === 0
//     >> PATCH { score: 15 >= x >= 0 }

// > ORDER
//   >> GET ALL
//     >> DEL => Recalc position
