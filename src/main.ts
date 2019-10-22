import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'

async function bootstrap (): Promise<void> {
    const app = await NestFactory.create(AppModule)
    const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}` : AppModule.host

    const swaggerOptions = new DocumentBuilder()
        .setTitle('Nest MEAN')
        .setDescription('Api Documentiona')
        .setVersion('1.0.0')
        .setHost(hostDomain.split('//')[1])
        .setSchemes(AppModule.isDev ? 'http' : 'https')
        .setBasePath('/api')
        .addBearerAuth('Authorization', 'header')
        .build()

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions)

    app.enableCors(
        {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: 'Content-Type, Accept'
        }
    )

    app.use('/api/docs/swagger.json', (req, res) => {
        res.send(swaggerDoc)
    })

    SwaggerModule.setup('/api/docs', app, null, {
        swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            showRequestDuration: true
        }
    })

    app.setGlobalPrefix('/api')
    app.useGlobalFilters(new HttpExceptionFilter())

    await app.listen(AppModule.port, () => {
        console.log('App is listening on port 8080')
    })
}
bootstrap()
