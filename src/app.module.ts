import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [//modulos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'opop',
      database: 'prueba',
      entities: [],    //entidades
      synchronize: true,
      keepConnectionAlive: true
    }),
    //AerolineaAeropuertoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}