/*
 * Trolls in the Cellar browser runtime for Troll Tales.
 *
 * Adapted from Mike Shea's CC0 generator template:
 * https://github.com/mshea/lazy_gm_tools/blob/main/5e_artisanal_database/generators/generator_template/index.html
 */
(function () {
  "use strict";

  class GeneratorEngine {
    parse(text) {
      const result = {};
      let currentKey = null;

      for (const line of text.trim().split(/\r?\n/)) {
        if (!line.trim()) continue;

        if (!/^\s/.test(line)) {
          currentKey = line.trim().replace(/:$/, "");
          if (!result[currentKey]) result[currentKey] = [];
          continue;
        }

        if (!currentKey) continue;

        const trimmed = line.trim();
        const weightMatch = trimmed.match(/^(.+?)\s*\^(\d+)$/);
        if (!weightMatch) {
          result[currentKey].push(trimmed);
          continue;
        }

        const item = weightMatch[1];
        const weight = Number.parseInt(weightMatch[2], 10);
        for (let i = 0; i < weight; i += 1) result[currentKey].push(item);
      }

      return result;
    }

    roll(data, tableName = "template") {
      const table = data[tableName];
      if (!table || table.length === 0) {
        throw new Error(`Missing random table: ${tableName}`);
      }

      return this.fill(this.pick(table), data);
    }

    fill(template, data) {
      let result = template;

      for (let i = 0; i < 10 && (result.includes("{") || result.includes("[[")); i += 1) {
        const before = result;
        result = this.processRanges(result);
        result = this.processDoubleBraceChoices(result, data);
        result = this.processSingleBraceChoices(result, data);
        result = this.processQuantityPatterns(result, data);
        result = this.processTableReferences(result, data);
        if (result === before) break;
      }

      return result.charAt(0).toUpperCase() + result.slice(1);
    }

    pick(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    processRanges(text) {
      return text.replace(/\[\[(\d+)-(\d+)\]\]/g, (_match, min, max) => {
        const low = Number.parseInt(min, 10);
        const high = Number.parseInt(max, 10);
        return String(Math.floor(Math.random() * (high - low + 1)) + low);
      });
    }

    processDoubleBraceChoices(text, data) {
      let result = text;
      let startIndex = 0;

      while (true) {
        const openIndex = result.indexOf("{{", startIndex);
        if (openIndex === -1) break;

        const closeIndex = this.findMatchingDoubleBrace(result, openIndex);
        if (closeIndex === -1) break;

        const content = result.substring(openIndex + 2, closeIndex);
        const { cleanContent, weight } = this.extractWeight(content);
        const options = cleanContent
          .split("|")
          .map((option) => option.replace(/^\{/, "").replace(/\}$/, "").trim())
          .filter(Boolean);

        if (options.length < 2) {
          startIndex = closeIndex + 2;
          continue;
        }

        const choices = this.createWeightedChoices(options, data, weight);
        const selected = this.pick(choices);
        result = result.substring(0, openIndex) + selected + result.substring(closeIndex + 2);
        startIndex = openIndex + selected.length;
      }

      return result;
    }

    findMatchingDoubleBrace(text, startIndex) {
      let braceCount = 0;

      for (let i = startIndex + 2; i < text.length - 1; i += 1) {
        const pair = text.substring(i, i + 2);
        if (pair === "{{") {
          braceCount += 1;
          i += 1;
        } else if (pair === "}}") {
          if (braceCount === 0) return i;
          braceCount -= 1;
          i += 1;
        }
      }

      return -1;
    }

    processSingleBraceChoices(text, data) {
      return text.replace(/\{([^}]+)\}/g, (match, content) => {
        if (!content.includes("|")) return match;

        const { cleanContent, weight } = this.extractWeight(content);
        const options = cleanContent.split("|");
        const cleaned = options.map((option) => {
          const trimmed = option.trim();
          const quoted = trimmed.match(/^"([^"]+)"$/);
          return quoted ? quoted[1] : trimmed;
        });

        return this.pick(this.createWeightedChoices(cleaned, data, weight));
      });
    }

    processQuantityPatterns(text, data) {
      return text.replace(/(\d+)\s+x\s+\{([^}]+)\}/g, (match, quantity, tableName) => {
        const qty = Number.parseInt(quantity, 10);
        const table = data[tableName];
        if (!table || table.length === 0) return match;
        if (qty === 0) return "";

        const items = [];
        for (let i = 0; i < qty; i += 1) items.push(this.pick(table));
        return items.join(", ");
      });
    }

    processTableReferences(text, data) {
      return text.replace(/\{(.*?)\}/g, (match, key) => {
        const table = data[key.trim()];
        return table && table.length > 0 ? this.pick(table) : match;
      });
    }

    extractWeight(content) {
      const weightMatch = content.match(/\s*\^(\d+)$/);
      return {
        cleanContent: content.replace(/\s*\^\d+$/, ""),
        weight: weightMatch ? Number.parseInt(weightMatch[1], 10) : 1,
      };
    }

    createWeightedChoices(options, data, weight) {
      const choices = [];

      for (let i = 0; i < options.length; i += 1) {
        const option = options[i];
        const table = data[option];
        const value = table && table.length > 0 ? this.pick(table) : option;
        const count = i === options.length - 1 ? weight : 1;
        for (let j = 0; j < count; j += 1) choices.push(value);
      }

      return choices;
    }
  }

  function normalizeWhitespace(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function cleanMarkdownTableCell(value) {
    return normalizeWhitespace(
      value
        .trim()
        .replace(/`?dice\+?:\s*\[\[[^\]#]+#\^([^\]\|]+)(?:\|[^\]]*)?\]\]`?/gi, "{$1}")
        .replace(/\*\*/g, "")
        .replace(/^`|`$/g, "")
    );
  }

  function isDiceColumnHeader(header) {
    const normalized = cleanMarkdownTableCell(header).toLowerCase();
    return (
      /^d\d+(?:\s*\+\s*d\d+)*$/.test(normalized) ||
      /^\d+d\d+$/.test(normalized) ||
      /^dice\s*:?\s*\d*d?\d+$/.test(normalized) ||
      (/\bd\d+\b/.test(normalized) && /\broll\b/.test(normalized)) ||
      normalized === "roll"
    );
  }

  function rowWeight(value) {
    const normalized = cleanMarkdownTableCell(value).replace(/\s/g, "");
    const range = normalized.match(/^(\d+)[-\u2013\u2014](\d+)$/);
    if (!range) return 1;

    const start = Number.parseInt(range[1], 10);
    let end = Number.parseInt(range[2], 10);
    if (end === 0 && start > 0) end = 100;
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 1;
    return Math.max(1, end - start + 1);
  }

  function mergeTableData(target, source) {
    Object.entries(source).forEach(([key, entries]) => {
      if (!target[key]) target[key] = [];
      target[key].push(...entries);
    });
  }

  function parseGeneratorConfig(source) {
    const config = {
      table: "template",
      count: 1,
      format: "list",
      sources: [],
    };
    let activeListKey = null;

    source.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      if (activeListKey && /^\s*-\s+/.test(line)) {
        config[activeListKey].push(trimmed.replace(/^-+\s+/, "").trim());
        return;
      }

      activeListKey = null;
      const match = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.*?)\s*$/);
      if (!match) return;

      const key = match[1].toLowerCase();
      const value = match[2];

      if (key === "table" && value) config.table = value;
      if (key === "source" || key === "sources") {
        activeListKey = "sources";
        if (value) config.sources.push(value);
      }
      if (key === "count") {
        const count = Number.parseInt(value, 10);
        if (Number.isFinite(count)) config.count = Math.max(1, Math.min(count, 100));
      }
      if (key === "format" && ["list", "paragraph"].includes(value)) config.format = value;
    });

    return config;
  }

  function getCodeBlocks(root, languageName) {
    const blocks = [];

    root.querySelectorAll(`pre > code.language-${languageName}`).forEach((code) => {
      blocks.push({
        source: code.textContent.replace(/\s+$/, ""),
        container: code.parentElement,
      });
    });

    root.querySelectorAll("p > code").forEach((code) => {
      const content = code.textContent || "";
      const prefix = `${languageName}\n`;
      if (!content.startsWith(prefix)) return;
      blocks.push({
        source: content.slice(prefix.length).replace(/\s+$/, ""),
        container: code.parentElement,
      });
    });

    return blocks;
  }

  function renderTableDataBlock(block) {
    block.container.remove();
  }

  function renderResults(container, results, format) {
    container.replaceChildren();

    if (format === "paragraph") {
      results.forEach((result) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = result;
        container.appendChild(paragraph);
      });
      return;
    }

    const list = document.createElement("ol");
    results.forEach((result) => {
      const item = document.createElement("li");
      item.textContent = result;
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  function renderError(container, message) {
    container.replaceChildren();
    const error = document.createElement("p");
    error.className = "tic-error";
    error.textContent = message;
    container.appendChild(error);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function parseMarkdownDiceTables(root, pageName) {
    const data = {};
    const records = [];
    const headingStack = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const tagName = node.tagName;

      if (/^H[1-6]$/.test(tagName)) {
        const level = Number.parseInt(tagName.slice(1), 10);
        const headingName = cleanMarkdownTableCell(node.textContent || "");
        headingStack.length = level - 1;
        if (!(level === 1 && headingName === pageName)) headingStack.push(headingName);
        continue;
      }

      if (tagName !== "TABLE") continue;

      const headerCells = node.querySelectorAll("thead th, tr:first-child th, tr:first-child td");
      if (headerCells.length < 2) continue;

      const headers = Array.from(headerCells).map((cell) => cleanMarkdownTableCell(cell.textContent || ""));
      if (!isDiceColumnHeader(headers[0])) continue;

      const rows = Array.from(node.querySelectorAll("tbody tr"));
      if (rows.length === 0) continue;

      const headingPath = headingStack.filter(Boolean).join("/");
      for (let columnIndex = 1; columnIndex < headers.length; columnIndex += 1) {
        const columnName = headers[columnIndex];
        if (!columnName) continue;

        const entries = [];
        rows.forEach((row) => {
          const cells = Array.from(row.children);
          if (cells.length <= columnIndex) return;

          const weight = rowWeight(cells[0].textContent || "");
          const value = cleanMarkdownTableCell(cells[columnIndex].textContent || "");
          if (!value) return;

          for (let copy = 0; copy < weight; copy += 1) entries.push(value);
        });

        if (entries.length === 0) continue;

        const fullKey = headingPath ? `${pageName}/${headingPath}/${columnName}` : `${pageName}/${columnName}`;
        const pageAliasKey = `${pageName}/${columnName}`;
        const localAliasKey = columnName;
        records.push({ fullKey, pageAliasKey, localAliasKey, entries });
      }
    }

    const pageAliasCounts = {};
    const localAliasCounts = {};
    records.forEach((record) => {
      pageAliasCounts[record.pageAliasKey] = (pageAliasCounts[record.pageAliasKey] || 0) + 1;
      localAliasCounts[record.localAliasKey] = (localAliasCounts[record.localAliasKey] || 0) + 1;
      if (!data[record.fullKey]) data[record.fullKey] = [];
      data[record.fullKey].push(...record.entries);
    });

    records.forEach((record) => {
      if (pageAliasCounts[record.pageAliasKey] === 1 && record.pageAliasKey !== record.fullKey) {
        if (!data[record.pageAliasKey]) data[record.pageAliasKey] = [];
        data[record.pageAliasKey].push(...record.entries);
      }

      if (localAliasCounts[record.localAliasKey] === 1) {
        if (!data[record.localAliasKey]) data[record.localAliasKey] = [];
        data[record.localAliasKey].push(...record.entries);
      }
    });

    return data;
  }

  function getPageName(article, contentRoot) {
    const articleHeading = article.querySelector("header h1");
    if (articleHeading) return cleanMarkdownTableCell(articleHeading.textContent || "");

    const contentHeading = contentRoot.querySelector("h1, h2");
    if (contentHeading) return cleanMarkdownTableCell(contentHeading.textContent || "");

    return cleanMarkdownTableCell(document.title.replace(/\s*-\s*[^-]+$/, ""));
  }

  function buildTableData(article, contentRoot, engine) {
    const pageName = getPageName(article, contentRoot);
    const data = {};
    const trollFoodBlocks = getCodeBlocks(contentRoot, "troll-food");

    trollFoodBlocks.forEach((block) => {
      mergeTableData(data, engine.parse(block.source));
    });

    mergeTableData(data, parseMarkdownDiceTables(contentRoot, pageName));

    return { data, trollFoodBlocks };
  }

  function renderGeneratorBlock(block, data, engine) {
    const config = parseGeneratorConfig(block.source);
    const widget = document.createElement("div");
    widget.className = "tic-widget";

    const controls = document.createElement("div");
    controls.className = "tic-controls";

    const rollButton = document.createElement("button");
    rollButton.type = "button";
    rollButton.textContent = "Roll";
    controls.appendChild(rollButton);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    controls.appendChild(copyButton);

    const output = document.createElement("div");
    output.className = "tic-output";

    widget.appendChild(controls);
    widget.appendChild(output);

    let latest = [];

    const roll = () => {
      try {
        if (config.sources.length > 0) {
          throw new Error("Cross-page generator sources are not supported on the blog yet.");
        }

        latest = [];
        for (let i = 0; i < config.count; i += 1) {
          latest.push(engine.roll(data, config.table));
        }
        renderResults(output, latest, config.format);
      } catch (error) {
        latest = [];
        renderError(output, error.message);
      }
    };

    rollButton.addEventListener("click", roll);
    copyButton.addEventListener("click", async () => {
      try {
        if (latest.length === 0) roll();
        if (latest.length === 0) return;
        await copyText(latest.join("\n"));
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1000);
      } catch (_error) {
        renderError(output, "Copy failed.");
      }
    });

    roll();
    block.container.replaceWith(widget);
  }

  function initializeGenerators() {
    const engine = new GeneratorEngine();
    const articles = document.querySelectorAll("article.post");

    articles.forEach((article) => {
      const contentRoot = article.querySelector(".post-content");
      if (!contentRoot) return;

      const { data, trollFoodBlocks } = buildTableData(article, contentRoot, engine);
      const trollSpeakBlocks = getCodeBlocks(contentRoot, "troll-speak");
      if (trollFoodBlocks.length === 0 && trollSpeakBlocks.length === 0) return;

      trollFoodBlocks.forEach((block) => {
        renderTableDataBlock(block);
      });

      trollSpeakBlocks.forEach((block) => {
        renderGeneratorBlock(block, data, engine);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGenerators);
  } else {
    initializeGenerators();
  }
})();
