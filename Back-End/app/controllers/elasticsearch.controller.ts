import {elasticSearchConfig} from "../config/connection"
import {Request, Response, Router} from "express"
import bodyParser from "body-parser"
const logger = require("pino")()
var app = Router()

app.use(bodyParser.json())

const createIndex = async (req: Request): Promise<void> => {
  var formAttributesFiltered = JSON.stringify(
    Object.assign({}, filterAttributesBasedOnIsearchable(req.body.attributes))
  )
  const elasticSearchAttributes = {
    attributes: formAttributesFiltered,
    trayId: JSON.parse(req.body.trayId),
    rackId: JSON.parse(req.body.rackId)
  }
  var myBody = JSON.stringify(elasticSearchAttributes)
  var index = req.body.name
  var type = req.body.name
  var routing = req.body.username
  await elasticSearchConfig.index(
    {
      index: index,
      body: myBody,
      id: req.body.rackId,
      type: type,
      routing: routing
    },
    function (err) {
      logger.error(err)
    }
  )
}

app.get("/living", (req: Request, res: Response) => {
  const searchText = req.query.searchString
  const data = elasticSearchConfig.search({
    index: "living",
    body: {
      query: {
        match: {name: searchText.trim()}
      }
    }
  })
  try {
    return res.json(data)
  } catch (e) {
    return res.status(500).json({message: e})
  }
})

function filterAttributesBasedOnIsearchable(formAttributes): void {
  var resultantAttributes = []
  let filteredObjects = formAttributes.filter(
    attributes => attributes.isSearchable == "true"
  )
  for (let i = 0; i < filteredObjects.length; i++) {
    resultantAttributes[i] =
      filteredObjects[i].label + ":" + filteredObjects[i].value
  }
}

export default {
  createIndex
}
