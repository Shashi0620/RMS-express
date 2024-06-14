import nodemailer from "nodemailer"
import hbs from "nodemailer-express-handlebars"
import path from "path"
import * as Handlebars from "handlebars"
import {allowInsecurePrototypeAccess} from "@handlebars/allow-prototype-access"
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  ssl: false,
  tls: true,
  auth: {
    user: "7bd05076efe846",
    pass: "0b176e306991f3"
  }
})
transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(__dirname, "../views/"),
      layoutsDir: path.join(__dirname, "../views/"),
      defaultLayout: "",
      handlebars: allowInsecurePrototypeAccess(Handlebars)
    },
    viewPath: path.join(__dirname, "../views/"),
    extName: ".hbs"
  })
)
export default transport
