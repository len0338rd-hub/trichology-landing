import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_HTML_SHA256 =
  "0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b";
const EXPECTED_HTML_BYTES = 5_291_924;
const EXPECTED_TOTAL_DECODED_BYTES = 3_939_706;
const EXPECTED_IMAGE_COUNT = 2;
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const expectedAssets = new Map([
  [
    "Консультация по эстетической трихологии",
    {
      fileName: "hero-consultation.png",
      width: 1448,
      height: 1086,
      base64Characters: 2_530_988,
      bytes: 1_898_239,
      sha256:
        "09cad3e3d2eda2a98cc8140913c83ce43fc41827b780efb8f906792367a8d2b8",
      requiredSectionClass: "hero",
      section: "Hero",
      usage: "Главное изображение в .hero-media",
    },
  ],
  [
    "Диагностика кожи головы",
    {
      fileName: "scalp-diagnostics.png",
      width: 1448,
      height: 1086,
      base64Characters: 2_721_956,
      bytes: 2_041_467,
      sha256:
        "bec183bbaa6254eaed0537799e3ebc8b094cfa0b04df2e354ff0041e0e862652",
      requiredSectionClass: "editorial",
      section: "Граница экспертности",
      usage: "Изображение в .editorial-img",
    },
  ],
]);

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const referenceHtmlPath = path.join(projectRoot, "reference", "index.html");
const originalAssetsDirectory = path.join(
  projectRoot,
  "reference",
  "assets-original",
);
const publicAssetsDirectory = path.join(projectRoot, "public", "images");

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function getAttribute(tag, attributeName) {
  const expression = new RegExp(
    `\\b${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    "i",
  );
  const match = tag.match(expression);

  return match?.[1] ?? match?.[2];
}

function findSectionContext(html, imageOffset) {
  const precedingHtml = html.slice(0, imageOffset);
  const sectionMatches = [...precedingHtml.matchAll(/<section\b[^>]*>/gi)];
  const latestSection = sectionMatches.at(-1);

  if (!latestSection || latestSection.index === undefined) {
    fail(
      `Не удалось определить секцию для изображения на offset ${imageOffset}.`,
    );
  }

  const latestClosingSection = precedingHtml.lastIndexOf("</section>");

  if (latestClosingSection > latestSection.index) {
    fail(`Изображение на offset ${imageOffset} находится вне секции.`);
  }

  const sectionTag = latestSection[0];
  const className = getAttribute(sectionTag, "class") ?? "";
  const id = getAttribute(sectionTag, "id");

  return { className, id, sectionTag };
}

function decodeCanonicalBase64(base64, alt) {
  if (base64.length === 0 || base64.length % 4 !== 0) {
    fail(`Некорректная длина Base64 для «${alt}».`);
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    fail(`Base64 содержит недопустимые символы для «${alt}».`);
  }

  const buffer = Buffer.from(base64, "base64");

  if (buffer.length === 0 || buffer.toString("base64") !== base64) {
    fail(`Base64 не является канонической или повреждена для «${alt}».`);
  }

  return buffer;
}

function readPngDimensions(buffer, alt) {
  if (buffer.length < 33) {
    fail(`PNG «${alt}» слишком короткий.`);
  }

  if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    fail(`Неверная PNG signature для «${alt}».`);
  }

  const ihdrLength = buffer.readUInt32BE(8);
  const ihdrType = buffer.toString("ascii", 12, 16);

  if (ihdrLength !== 13 || ihdrType !== "IHDR") {
    fail(`Первый PNG chunk для «${alt}» не является корректным IHDR.`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function inspectTarget(targetPath, expectedBuffer) {
  if (!existsSync(targetPath)) {
    return "missing";
  }

  const existingBuffer = readFileSync(targetPath);

  if (!existingBuffer.equals(expectedBuffer)) {
    fail(
      `Файл уже существует, но отличается от эталона: ${path.relative(projectRoot, targetPath)}`,
    );
  }

  return "identical";
}

function writeMissingTarget(targetPath, buffer, state) {
  if (state === "identical") {
    return "уже существует и идентичен";
  }

  writeFileSync(targetPath, buffer, { flag: "wx" });

  const writtenBuffer = readFileSync(targetPath);

  if (!writtenBuffer.equals(buffer)) {
    fail(`Ошибка верификации записанного файла: ${targetPath}`);
  }

  return "создан и проверен";
}

function main() {
  const htmlBuffer = readFileSync(referenceHtmlPath);
  const htmlSha256 = sha256(htmlBuffer);

  if (htmlBuffer.length !== EXPECTED_HTML_BYTES) {
    fail(
      `Размер reference/index.html: ${htmlBuffer.length}, ожидалось ${EXPECTED_HTML_BYTES}.`,
    );
  }

  if (htmlSha256 !== EXPECTED_HTML_SHA256) {
    fail(
      `SHA-256 reference/index.html: ${htmlSha256}, ожидалось ${EXPECTED_HTML_SHA256}.`,
    );
  }

  const html = htmlBuffer.toString("utf8");
  const imageTagMatches = [...html.matchAll(/<img\b[^>]*>/gi)];
  const allSrcAttributes = [
    ...html.matchAll(/\bsrc\s*=\s*(?:"[^"]*"|'[^']*')/gi),
  ];
  const inlineSvgCount = [...html.matchAll(/<svg\b/gi)].length;
  const cssUrlCount = [...html.matchAll(/url\s*\(/gi)].length;

  if (imageTagMatches.length !== EXPECTED_IMAGE_COUNT) {
    fail(
      `Найдено <img>: ${imageTagMatches.length}, ожидалось ${EXPECTED_IMAGE_COUNT}.`,
    );
  }

  const assets = imageTagMatches.map((imageMatch, index) => {
    const tag = imageMatch[0];
    const alt = getAttribute(tag, "alt");
    const src = getAttribute(tag, "src");

    if (!alt) {
      fail(`У изображения №${index + 1} отсутствует непустой alt.`);
    }

    if (!src) {
      fail(`У изображения «${alt}» отсутствует src.`);
    }

    const dataUriMatch = src.match(
      /^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/i,
    );

    if (!dataUriMatch) {
      fail(`Изображение «${alt}» не является Base64 data URI.`);
    }

    const mimeType = dataUriMatch[1].toLowerCase();
    const base64 = dataUriMatch[2];

    if (mimeType !== "image/png") {
      fail(`MIME type «${alt}»: ${mimeType}; ожидался image/png.`);
    }

    const expected = expectedAssets.get(alt);

    if (!expected) {
      fail(`Нет ожидаемой конфигурации для alt «${alt}».`);
    }

    const buffer = decodeCanonicalBase64(base64, alt);
    const dimensions = readPngDimensions(buffer, alt);
    const digest = sha256(buffer);
    const sectionContext = findSectionContext(html, imageMatch.index);

    if (
      !sectionContext.className
        .split(/\s+/)
        .includes(expected.requiredSectionClass)
    ) {
      fail(
        `Изображение «${alt}» найдено не в ожидаемой секции .${expected.requiredSectionClass}.`,
      );
    }

    if (base64.length !== expected.base64Characters) {
      fail(
        `Base64 «${alt}»: ${base64.length} символов, ожидалось ${expected.base64Characters}.`,
      );
    }

    if (buffer.length !== expected.bytes) {
      fail(
        `Размер «${alt}»: ${buffer.length} байт, ожидалось ${expected.bytes}.`,
      );
    }

    if (
      dimensions.width !== expected.width ||
      dimensions.height !== expected.height
    ) {
      fail(
        `Размеры «${alt}»: ${dimensions.width}×${dimensions.height}, ожидалось ${expected.width}×${expected.height}.`,
      );
    }

    if (digest !== expected.sha256) {
      fail(`SHA-256 «${alt}»: ${digest}, ожидалось ${expected.sha256}.`);
    }

    return {
      index: index + 1,
      alt,
      mimeType,
      base64Characters: base64.length,
      buffer,
      bytes: buffer.length,
      width: dimensions.width,
      height: dimensions.height,
      sha256: digest,
      sectionContext,
      ...expected,
    };
  });

  const uniqueAlts = new Set(assets.map((asset) => asset.alt));

  if (uniqueAlts.size !== assets.length) {
    fail("Значения alt изображений не уникальны.");
  }

  if (assets.length !== expectedAssets.size) {
    fail(
      `Проверено assets: ${assets.length}, ожидаемых записей: ${expectedAssets.size}.`,
    );
  }

  const totalDecodedBytes = assets.reduce(
    (total, asset) => total + asset.bytes,
    0,
  );

  if (totalDecodedBytes !== EXPECTED_TOTAL_DECODED_BYTES) {
    fail(
      `Суммарный размер: ${totalDecodedBytes}, ожидалось ${EXPECTED_TOTAL_DECODED_BYTES}.`,
    );
  }

  const targetStates = assets.map((asset) => {
    const originalPath = path.join(originalAssetsDirectory, asset.fileName);
    const publicPath = path.join(publicAssetsDirectory, asset.fileName);

    return {
      asset,
      originalPath,
      publicPath,
      originalState: inspectTarget(originalPath, asset.buffer),
      publicState: inspectTarget(publicPath, asset.buffer),
    };
  });

  mkdirSync(originalAssetsDirectory, { recursive: true });
  mkdirSync(publicAssetsDirectory, { recursive: true });

  console.log(`Источник: ${path.relative(projectRoot, referenceHtmlPath)}`);
  console.log(`HTML SHA-256: ${htmlSha256}`);
  console.log(`HTML bytes: ${htmlBuffer.length}`);
  console.log(`Найдено <img>: ${imageTagMatches.length}`);
  console.log(`Найдено src: ${allSrcAttributes.length}`);
  console.log(`Inline SVG: ${inlineSvgCount}`);
  console.log(`CSS url(...): ${cssUrlCount}`);

  for (const target of targetStates) {
    const { asset } = target;
    const originalResult = writeMissingTarget(
      target.originalPath,
      asset.buffer,
      target.originalState,
    );
    const publicResult = writeMissingTarget(
      target.publicPath,
      asset.buffer,
      target.publicState,
    );

    console.log(`\n[${asset.index}/${assets.length}] ${asset.alt}`);
    console.log(`MIME: ${asset.mimeType}`);
    console.log(
      `Секция: ${asset.section} (${asset.sectionContext.sectionTag})`,
    );
    console.log(`Использование: ${asset.usage}`);
    console.log(`Base64 characters: ${asset.base64Characters}`);
    console.log(`Dimensions: ${asset.width}×${asset.height}`);
    console.log(`Decoded bytes: ${asset.bytes}`);
    console.log(`SHA-256: ${asset.sha256}`);
    console.log(
      `${path.relative(projectRoot, target.originalPath)}: ${originalResult}`,
    );
    console.log(
      `${path.relative(projectRoot, target.publicPath)}: ${publicResult}`,
    );
  }

  console.log(`\nСуммарный декодированный размер: ${totalDecodedBytes} байт`);
  console.log("Все эталонные значения подтверждены.");
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Ошибка извлечения assets: ${message}`);
  process.exitCode = 1;
}
