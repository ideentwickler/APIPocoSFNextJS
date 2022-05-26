import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AboutModule } from './about/about.module';
import { SalesforceModule } from './salesforce/salesforce.module';
import { PosModule } from './pos/pos.module';
import { StartModule } from './start/start.module';
import { BrochuresModule } from './brochures/brochures.module';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration#configuration=
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }, // set to true to access to environment variables from every module
    ),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
      max: 100,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    AboutModule,
    SalesforceModule,
    PosModule,
    StartModule,
    BrochuresModule,
  ],
})
export class AppModule {}
