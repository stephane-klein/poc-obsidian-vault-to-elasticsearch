import MarkdownIt from "markdown-it";
import { hashtag, spanHashAndTag } from "@fedify/markdown-it-hashtag";
import lazy_loading from "markdown-it-image-lazy-loading";
import WikiLinkPlugin from "./wikilink.js";

const md = new MarkdownIt({
    html: true,
    linkify: true
});
md.use(WikiLinkPlugin());
md.use(
    hashtag,
    {
        link: (tag) => `/search/?tags=${tag.substring(1)}`,
        linkAttributes: () => ({ class: "hashtag" }),
        label: spanHashAndTag,
    }
);
md.use(lazy_loading);

export default md;
