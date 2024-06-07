// start/routes/url-shortener.ts
import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/:shortenedUrl", "UrlShortenerController.redirect");

  // Private routes
  Route.group(() => {
   
    Route.post("/url-shortener", "UrlShortenerController.store");

  }).middleware("auth:api");
}).prefix("/api");
