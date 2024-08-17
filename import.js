#!/usr/bin/env node
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import yaml from "js-yaml";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: "http://localhost:9200",
    settings: {
        analysis: {
            analyzer: {
                french_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: [
                        "lowercase",
                        "asciifolding",
                        "french_elision",
                        "french_stop",
                        "french_stemmer"
                    ],
                    char_filter: [
                        "html_strip"
                    ]
                }
            },
            filter: {
                french_elision: {
                    type: "elision",
                    articles_case: true,
                    articles: [
                        "l", "m", "t", "qu", "n", "s", "j", "d", "c", "jusqu", "quoiqu", "lorsqu", "puisqu"
                    ]
                },
                french_stop: {
                    type: "stop",
                    stopwords: "_french_"
                },
                french_stemmer: {
                    type: "stemmer",
                    language: "light_french"
                }
            }
        }
    },
    mappings: {
        properties: {
            title: {
                type: "text",
                analyzer: "french_analyzer"
            },
            tags: "keyword",
            content: {
                type: "text",
                analyzer: "french_analyzer"
            }
        }
    }
})
await client.indices.delete({ index: "notes", ignore_unavailable: true });
await client.indices.create({ index: "notes" });

for await (const filename of (await glob("content/**/*.md"))) {
    const data = matter.read(filename, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA })
        }
    });
    console.log(`Import ${filename}`);
    await client.index({
        index: "notes",
        id: filename,
        document: {
            title: data.data?.title || path.basename(filename, path.extname(filename)),
            tags: data.data?.tags || [],
            content: data.content
        },
    });
}
