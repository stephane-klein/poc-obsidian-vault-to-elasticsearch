# POC to import Obsidian vault to Elasticsearch

Project goal description (in french): https://notes.sklein.xyz/Projets/Projet-13

See also: [`obsidian-vault-to-pg_search`](https://github.com/stephane-klein/obsidian-vault-to-pg_search) and [`obsidian-vault-to-typesense`](https://github.com/stephane-klein/obsidian-vault-to-typesense).

```sh
$ mise install
$ pnpm install
$ mkdir -p volumes/elasticsearch/; chmod ugo+rwX volumes/elasticsearch/
$ docker compose up -d --wait
```

```sh
$ ./import.js
```

```sh
$ ./playground.js
```
