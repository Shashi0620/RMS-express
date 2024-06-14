import elasticsearch from "elasticsearch"
export const elasticSearchConfig = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
  apiVersion: "7.3" // use the same version of your Elasticsearch inst
})
