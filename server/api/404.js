// @ts-check
export function gen404(ctx) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body style="text-align: center;">
      <h1>404 Not Found</h1>
      <h2><code>${ctx.method} ${ctx.path}</code></h2>
    </body>
    </html>
  `;
}
