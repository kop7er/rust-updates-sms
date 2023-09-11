FROM denoland/deno:1.36.4

WORKDIR /app

COPY . .

RUN deno cache main.ts

CMD ["run", "--allow-read", "--allow-env", "--allow-net", "main.ts"]
