#!/usr/bin/env node
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import yaml from "js-yaml";

//client.collections("notes").delete()

//client.collections().create(notesSchema);


import { Client } from "@elastic/elasticsearch";
const client = new Client({
    node: "http://localhost:9200",
    mappings: {
        properties: {
            title: "text",
            tags: "keyword",
            content: {
                type: "text"
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
