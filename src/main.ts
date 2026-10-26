import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NextFunction, Request, Response } from "express";
import * as express from "express";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : ["http://localhost:3000"],
  });

  const candidateRoots = [
    join(__dirname, "..", "web"),
    join(__dirname, "..", "..", "web"),
  ];

  const webRoot =
    candidateRoots.find(
      (candidate) =>
        existsSync(candidate) && existsSync(join(candidate, "index.html")),
    ) ?? candidateRoots[0];

  app.use(express.static(webRoot));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || req.path.startsWith("/graphql")) {
      return next();
    }

    return res.sendFile(join(webRoot, "index.html"));
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Portfolio is available at http://localhost:${port}`);
}

void bootstrap();
