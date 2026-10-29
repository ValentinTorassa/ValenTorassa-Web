# Activar y comprobar los clics de la muestra

Estado al 29/10/2026: **medición activada y comprobada en producción**. La migración `0010` quedó aplicada en `pluma-vt`, con base inicial de 0. El cliente está integrado en [PR #33](https://github.com/ValentinTorassa/ValenTorassa-Web/pull/33), commit `f26e033c4065b63be2219fa31f9220249b4020eb`, deploy `dpl_3RU46TFV2tGbGRT5XYdhqtNFtQJp`. Dos clics técnicos se comprobaron por SQL y se retiraron: base final 0, sin filas. [Comprobante sanitizado](qa/book-clicks-2026-10-29.json). El seguimiento está en VT-Tasks, tarea `mvt05qizf0542ab14d`.

## Publicado y verificado

- Web: commit `6b6a0e8c87b9402755b62a288147577c0b506502`.
- [Página del libro](https://valentorassa.com/libro), con muestra de 15 páginas sin registro y lista opcional. Conserva `?ref=` al ir a Pluma y al cambiar de idioma.
- [PDF aprobado](https://valentorassa.com/libro/muestra-capitulo-1.pdf): SHA256 `6a862f3eff8d93bb257134e1c2316b40f314a0553bb13e4060158f98fbc53de3`.
- [Captura real de página 2](https://valentorassa.com/libro/muestra/page-02.png): SHA256 `5906d74e1b702c1eedd301149de96d2d5f7b4f8b76ef326087b314e5371d04c9`.
- Backend: [Pluma PR #51](https://github.com/ValentinTorassa/pluma/pull/51), integrado en `3c45e7586115191f0394b2ffdc8509760509ae4d` y desplegado en VT y Yanina.
- Cliente publicado: commit `f26e033`, reemplaza Custom Events de Vercel Hobby por el contador propio. No requiere contratar un plan.

## Qué significa la métrica

`book_clicks` guarda sólo `day`, `event`, `ref`, `count`. El día es de Argentina y los eventos son `pdf` y `lista`. Los 20 refs permitidos están en `src/bookMetrics.ts` y en `Pluma/src/lib/book-event.ts`; incluyen `muestra-instagram-stories`. Desconocidos van a `otro`: máximo 40 filas/día.

Se cuentan clics explícitos, incluso repetidos, en los enlaces al PDF o a la lista. No son personas únicas, descargas terminadas, lecturas ni altas. No se guarda IP, hash, user agent, cookies ni identificadores. El cliente omite credenciales. El servidor excluye sesiones admin cuando las recibe; una petición desde el otro dominio no puede reconocer esa sesión. Un `Origin` falsificado puede inflar el contador.

El endpoint sólo acepta `https://valentorassa.com`, `https://vtsecurity.com.ar` y `https://blog.valentorassa.com`, cuerpo máximo de 512 bytes y los dos tipos de evento. Los fallos no impiden abrir el recurso.

## Procedimiento de activación y comprobación

1. Renovar la sesión de la cuenta Turso existente con su flujo normal. No copiar secretos a este repo, a los recibos o al chat. El token de VT-Radar es de sólo lectura. No usar `db:push` ni un migrador contra producción.
2. Para una instancia que aún no tenga la tabla, desde el repo hermano **Pluma** aplicar exclusivamente el SQL ya revisado. En `pluma-vt` se aplicó el 29/10/2026:

   ```sh
   turso db shell pluma-vt < drizzle/0010_book_clicks.sql
   turso db shell pluma-vt "SELECT name, sql FROM sqlite_master WHERE type='table' AND name='book_clicks';"
   turso db shell pluma-vt "SELECT COALESCE(SUM(count),0) AS total FROM book_clicks;"
   turso db shell pluma-vt "SELECT day, event, ref, count FROM book_clicks ORDER BY day DESC, event, ref;"
   ```

   Registrar esa base antes de la prueba. El SQL es únicamente:

   ```sql
   CREATE TABLE IF NOT EXISTS book_clicks (
     day text NOT NULL,
     event text NOT NULL,
     ref text NOT NULL,
     count integer DEFAULT 0 NOT NULL,
     PRIMARY KEY(day, event, ref)
   );
   ```

3. Con la tabla confirmada y checks verdes, integrar el cliente según el workflow del repo y verificar su deploy. PR #33 ya se integró y se publicó después de crear la tabla.
4. Desde **ValenTorassa-Web**, ejecutar una sola vez la prueba de navegador. Requiere Playwright del repo y Brave (o `PLAYWRIGHT_CHROME_PATH`):

   ```sh
   node scripts/verify-book-clicks.mjs --acknowledge-two-production-clicks
   ```

   Hace exactamente un clic `pdf` y un clic `lista` con `ref=muestra-pdf`. Impide abrir los destinos, no envía formularios y no crea suscriptores. Comprueba la respuesta real del endpoint. Guarda `test-results/book-click-live/receipt.json` y genera `cleanup.sql` sólo con los incrementos confirmados. Rechaza sobreescribir un recibo previo. La lectura del cuerpo tiene un límite de cinco segundos; un timeout exige consultar Turso antes de repetir nada. Después de corroborar y conservar una ejecución parcial, `--events=lista` permite probar únicamente la lista (también acepta `--events=pdf`). Esos archivos están ignorados por Git. Conservarlos con el recibo operativo antes de limpiar los resultados de tests.
5. Consultar `book_clicks` y contrastar los dos incrementos con el recibo. Si hubo un timeout o respuesta perdida, revisar la tabla antes de reintentar: una respuesta no recibida no prueba que el servidor no haya contado.
6. Revisar el `cleanup.sql` generado y ejecutarlo una sola vez desde **ValenTorassa-Web**:

   ```sh
   turso db shell pluma-vt < test-results/book-click-live/cleanup.sql
   turso db shell pluma-vt "SELECT COALESCE(SUM(count),0) AS total FROM book_clicks;"
   ```

   La limpieza resta uno por cada evento técnico confirmado y sólo borra las filas correspondientes si quedan en cero. Conserva clics orgánicos concurrentes. No es idempotente: no volver a ejecutar. No borrar toda la tabla ni resetear sus contadores.
7. Registrar commit y deploy, base inicial, recibo de los dos clics y conteo posterior a la limpieza. Sólo entonces informar que funciona la medición.

## Evidencia ya obtenida

- Web: lint y build; pruebas de `/libro`: 11 pasaron y 16 se omiten por viewport según la configuración. Las llamadas del test se interceptan localmente; no escriben en producción. Stories conserva su ref en PDF/lista.
- Pluma: lint, 224 pruebas Vitest y 15 de admin; builds locales y CI de ambos tenants. [CI del commit integrado](https://github.com/ValentinTorassa/pluma/actions/runs/40815189472) y [Security](https://github.com/ValentinTorassa/pluma/actions/runs/40815190063) pasaron.
- Paridad Yanina: 32 capturas con cero píxeles distintos; HTML y status de 26 rutas iguales; ícono y tres OG iguales por hash. El diff RSC sólo cambió rutas de chunks webpack en 17 comparaciones; normalizando exclusivamente esas rutas coincidió. La nueva ruta no existe en Yanina.
- Producción: OPTIONS de origen permitido 204; evento inválido 400; origen ajeno 403; GET VT 405; GET Yanina 404. Esas peticiones no incrementan contadores.
- Producción activada: tabla creada, base inicial 0; un clic PDF y uno de lista desde Brave con `ref=muestra-pdf`, ambos HTTP 200. Turso confirmó `pdf=1` y `lista=1` el 29/10/2026; se restaron exactamente esos incrementos y se eliminaron únicamente sus filas en cero. Base final 0, ninguna fila. No se enviaron formularios ni se crearon suscriptores.
- Limitación de la prueba: `response.json()` de Playwright quedó esperando. El primer intento se detuvo después del PDF; se probó sólo lista con timeout. No se repitió PDF. La persistencia se verificó mediante SQL y la limpieza se basó en esa evidencia; el comprobante conserva ambas ejecuciones y esta limitación. No se afirma haber leído el JSON de esas respuestas.

## Consulta D+1 y D+7

```sql
SELECT day, event, ref, count
FROM book_clicks
ORDER BY day DESC, event, ref;
```

Las altas aceptadas siguen en `newsletter_signups`, aparte. No sumarlas ni presentarlas como equivalentes a los clics.
