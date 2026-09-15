import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const readProjectFile = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("HTML saglabā semantiku un drošus ārējos linkus", () => {
  const html = readProjectFile("index.html");
  assert.equal((html.match(/id="question-container"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /\sonclick\s*=/i);
  assert.match(html, /© Vidzemes Tehnoloģiju un dizaina tehnikums/);

  const blankLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) ?? [];
  assert.ok(blankLinks.length > 0);
  for (const link of blankLinks) {
    assert.match(link, /rel="[^"]*noopener[^"]*"/i);
    assert.match(link, /rel="[^"]*noreferrer[^"]*"/i);
  }
});

test("atbilžu pogām ir četru soļu zaļi sarkana skala", () => {
  const css = readProjectFile("styles.css");
  assert.match(css, /grid-template-columns:\s*repeat\(4,/);
  assert.match(css, /\.option-button--yes/);
  assert.match(css, /\.option-button--rather_yes/);
  assert.match(css, /\.option-button--rather_no/);
  assert.match(css, /\.option-button--no/);
  assert.match(css, /--color-yes-strong:/);
  assert.match(css, /--color-no-strong:/);
});

test("Draw.io ir trīs rediģējamas lapas un katrai malai ir galapunkti", () => {
  const xml = readProjectFile("docs/VTDT-profesiju-izveles-modelis.drawio");
  const pages = [...xml.matchAll(/<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/g)];
  assert.equal(pages.length, 3);
  assert.deepEqual(
    pages.map(([, attributes]) => attributes.match(/\bname="([^"]+)"/)?.[1]),
    ["Lietotāja ceļš", "Punktu aprēķins", "Jautājumu pārklājums"],
  );

  let edgeCount = 0;
  for (const [, , body] of pages) {
    const ids = new Set(
      [...body.matchAll(/<mxCell\b[^>]*\bid="([^"]+)"[^>]*>/g)].map(
        (match) => match[1],
      ),
    );
    const edges = [...body.matchAll(/<mxCell\b[^>]*\bedge="1"[^>]*>/g)];
    edgeCount += edges.length;
    for (const [edge] of edges) {
      const source = edge.match(/\bsource="([^"]+)"/)?.[1];
      const target = edge.match(/\btarget="([^"]+)"/)?.[1];
      assert.ok(source && ids.has(source), `Nederīgs source: ${source}`);
      assert.ok(target && ids.has(target), `Nederīgs target: ${target}`);
    }
  }
  assert.ok(edgeCount >= 20);
});

test("direktora Word un PDF artefakti ir ģenerēti", () => {
  const docx = statSync(
    new URL("../docs/VTDT-karjeras-paligs-direktoram.docx", import.meta.url),
  );
  const pdf = statSync(
    new URL(
      "../output/pdf/VTDT-karjeras-paligs-direktoram.pdf",
      import.meta.url,
    ),
  );
  assert.ok(docx.size > 100_000);
  assert.ok(pdf.size > 100_000);
});
