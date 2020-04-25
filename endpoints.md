# Endpoints

### Using Query String

```shell
/path/or/url/of/endpoint/?paramter1=valueOfparameter&&paramter2=valueOfparameter&&paramter3=valueOfparameter
```

> - paramter specified with '!' are compulsary parameter
> - if this parameter is not specified then admin action is needed
> - other parameters are optional

| Action           | Endpoint                                 | Use case                                                     | Query Parameters                                                     | Post Object Format                                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **login**        |
| POST             | /login                                   | Login user/vendor/admin                                      |                                                                      | type, device_fcm_token, contact                                                                                                                                                                                                               |
| **vendor**       |
| POST             | /vendor                                  | Signup for a vendor                                          |                                                                      | name(string), type('farmer', 'shopkeeper'), state_id(integer from state table), city_id(integer from city table), pin_code(integer 6-digit), address(string), contact(integer 10-digit), profile_picture(string url),device_fcm_token(string) |
| GET              | /vendor                                  | Shows all registered vendors                                 | limit(integer), offset(integer)                                      |
| GET              | /vendor/:vendor_id                       | Shows a specific vendor                                      |
| PATCH            | /vendor/:vendor_id                       | Edit Profile of a vendor                                     |                                                                      | name(string), type('farmer', 'shopkeeper'), state_id(integer from state table), city_id(integer from city table), pin_code(integer 6-digit), address(string), contact(integer 10-digit), profile_picture(string url)                          |
| **user**         |
| POST             | /user                                    | Register a new user                                          |                                                                      | name(string), state_id(integer from state table), city_id(integer from city table), pin_code(integer 6-digit), address(string), contact(integer 10-digit), profile_picture(string url),device_fcm_token(string)                               |
| GET              | /user                                    | Show all registered users                                    | limit(integer), offset(integer)                                      |
| GET              | /user/:user_id                           | Show a specific user                                         |
| PATCH            | /user/:user_id                           | Edit Profile of a user                                       |                                                                      | name(string), state_id(integer from state table), city_id(integer from city table), pin_code(integer 6-digit), address(string), contact(integer 10-digit), profile_picture(string url)                                                        |
| **user cart**    |
| GET              | /user/:user_id/cart                      | Shows the cart of a user unless product id specified         | product_id(comma seprated integer), limit(integers), offset(integer) |
| POST             | /user/:user_id/cart                      | Adds an item to the cart                                     |                                                                      | crop_id(interger), qty(decimal)                                                                                                                                                                                                               |
| DELETE           | /user/:user_id/cart                      | Empty the user cart unless product_id parameter is specified | product_id(comma seprated integers)                                  |
| **order**        |
| GET              | /order                                   | GET all orders unless user_id is specified                   | user_id(integer),limit(integer), offset(integer)                     |
| POST             | /order                                   | Place an order                                               |                                                                      | user_id(integer), delivery_address(string), price(decimal), product_id(array of integers)                                                                                                                                                     |
| GET              | /order/:order_id                         |
| DELETE           | /order/:order_id                         | Cancel order                                                 |
| **crop**         |
| GET              | /crop                                    | Shows all crops unless vendor_id specified                   | vendor_id(integer) limit(integer), offset(integer)                   |
| POST             | /crop                                    | Adds a crop                                                  |                                                                      | vendor_id(integer), qty(decimal), crop_name(string), crop_type_id(integer from crop table), packed_date(string 'YYYY-MM-DD HH:MM:SS')                                                                                                         |
| GET              | /crop/:crop_id                           | Shows a specific crop                                        |
| DELETE           | /crop                                    | Deletes all crop unless crop_id or vendor_id is specified    | !vendor_id(integer), !crop_id(integer)                               |
| **notification** | NOT SET                                  |
| GET              | /notification                            | Shows all notification sent                                  |
| POST             | /notification                            | NOT SET                                                      |
| **complaint**    |
| GET              | /complaint                               | Get all the complaints unless user_id is specified           | user_id(integer), limit(integer), offset(integer)                    |
| POST             | /complaint                               | Register a new complaint                                     |                                                                      | order_id(integer), type(string), proof_id(array of integers)                                                                                                                                                                                  |
| GET              | /complaint/:complaint_id                 | Shows full complaint details                                 |
| GET              | /complaint/:complaint_id/proof           | Shows the complaint proofs                                   | limit(integer), offset(integer)                                      |
| POST             | /complaint/:complaint_id/proof           | Registering a proof                                          |                                                                      | type('image', 'pdf'), resource_url(string url)                                                                                                                                                                                                |
| GET              | /complaint/:complaint_id/proof/:proof_id |
| **admin**        | PROTECTED URL                            |
| GET              | /admin                                   | Get all admins                                               |                                                                      |
| POST             | /admin/ban/user/:user_id                 | Bans a user                                                  |
| POST             | /admin/ban/vendor/:vendor_id             | Bans a vendor                                                |
| GET              | /city                                    | Show all cities                                              | limit(integer), offset(integer)                                      |
| POST             | /city                                    | Add a new city                                               |                                                                      | name(string)                                                                                                                                                                                                                                  |
| DELETE           | /city                                    | Deletes all city unless city_id specified                    | !city_id(comma seprated integers)                                    |
| PATCH            | /city/:city_id                           | Edit city_id specified                                       |                                                                      | !name(string)                                                                                                                                                                                                                                 |
| GET              | /state                                   |                                                              | limit(integer), offset(integer)                                      |
| POST             | /state                                   |                                                              | name(string)                                                         |
| DELETE           | /state                                   | Deletes all state unless state_id specified                  | !state_id(comma seprated integers)                                   |
| PATCH            | /state/:state_id                         | Edit state_id specified                                      |                                                                      | !name(string)                                                                                                                                                                                                                                 |
| GET              | /crop_type                               | limit(integer), offset(integer)                              |
| POST             | /crop_type                               |
| DELETE           | /crop_type                               | Deletes all crop_types unless crop_type_id specified         | !crop_type_id(comma seprated integers)                               |
| PATCH            | /crop_type/:crop_type_id                 | Edit crop_type_id specified                                  |                                                                      | !name(string)                                                                                                                                                                                                                                 |
| **misc**         | NOT SET                                  |
| POST             | /upload                                  | Upload any image or file                                     |
