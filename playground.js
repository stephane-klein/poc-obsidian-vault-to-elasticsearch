#!/usr/bin/env node
import { Client } from "@elastic/elasticsearch";

const client = new Client({
    node: "http://localhost:9200",
});

console.log("Search « pour le moment » and highlight the results");
let response = await client.search({
    index: "notes",
    _source: ["title", "content_html", "tags"],
    size: 1,
    body: {
        query: {
            match: {
                content_html: {
                    query: "pour le moment",
                    operator: "and"
                }
            }
        },
        highlight: {
            fields : {
                content_html : { "number_of_fragments" : 0}
            }
        }
    }
});
console.log("First element:")
console.log("Title:", response.hits.hits[0]._source.title);
console.log("Highlight content:", response.hits.hits[0].highlight.content_html[0]);

console.log("\n------\n");

console.log("Search « itération » and tags 'coding' and 'javascript'");
response = await client.search({
    index: "notes",
    body: {
        _source: ["title", "content_html", "tags"],
        query: {
            bool: {
                must: [
                    {
                        match: {
                            content_html: {
                                query: "pour le moment",
                                operator: "and"
                            }
                        }
                    }
                ],
                filter: [
                    {
                        terms: {
                            tags: ["coding", "javascript"]
                        }
                    }
                ]
            }
        },
        highlight: {
            fields: {
                content_html : { "number_of_fragments" : 0}
            }
        }
    }
});
for (const row of (response.hits.hits)) {
    console.log(row._source.title);
}
