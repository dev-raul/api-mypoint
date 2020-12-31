"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", ({ request, response }) => {
  return { gretting: "Hello" };
});

Route.post("user", "UserController.store");
Route.post("session", "SessionController.store");

Route.group(() => {
  Route.put("user/:id", "UserController.update");
  Route.get("user/", "UserController.show");

  Route.get("user/:user_id/file", "FileController.index");
  Route.resource("file", "FileController").except(["index"]);

  Route.post("/user/:id/profile", "ProfileController.store");
}).middleware(["auth"]);
