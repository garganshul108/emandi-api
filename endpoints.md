# Endpoints

### Using Query String

```shell
/path/or/url/of/endpoint/?paramter1=valueOfparameter&&paramter2=valueOfparameter&&paramter3=valueOfparameter
```

> - paramter specified with '!' are compulsary parameter
> - if this parameter is not specified then admin action is needed
> - other parameters are optional

### Login/Signup

| Action | Endpoint    | Use case                        | Query Parameters                             | Post Object Format                                                                                 | Special Token Needed | Return                |
| ------ | ----------- | ------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------- | --------------------- |
| POST   | /login      | Login admin                     |                                              | type(admin; vendor; user)<br/><br/>username<br/><br/>password                                      |                      | admin_token in header |
| GET    | /otp_login  | vendor; user; for getting OTP   | type("vendor";"user")<br/><br/>contact(int)  |                                                                                                    |                      |
| POST   | /otp_login  | vendor; user for confirming OTP |                                              | contact(int)<br/><br/> otp(int)<br/><br/> type("vendor";"user")<br/><br/> device_fcm_token(string) |                      | token in header       |
| GET    | /otp_signup |                                 | contact(int)<br/><br/> type("vendor";"user") |                                                                                                    |                      |
| POST   | /otp_signup |                                 |                                              | contact(int)<br/><br/> otp(int)<br/><br/> type("vendor","user")<br/><br/> device_fcm_token(string) |                      | token in header       |

### Special / Universal

| Action | Endpoint       | Use case                    | Query Parameters                           | Post Object Format                                                  | Special Token Needed | Return                     |
| ------ | -------------- | --------------------------- | ------------------------------------------ | ------------------------------------------------------------------- | -------------------- | -------------------------- |
| GET    | /city          | Show all cities             | limit (integer)<br/><br/> offset (integer) |                                                                     |                      | result enclosed in []      |
| POST   | /city          | Add a new city              |                                            | name (string)<br/><br/>state_id(valid int)                          | admin token          | posted city enclosed by [] |
| DELETE | /city/:id      | Deletes city                |                                            |                                                                     | admin                |
| PUT    | /city/:id      | Edit city_id specified      |                                            | name (string)<br/><br/>state_id                                     | admin                | edited city enclosed by [] |
| GET    | /state         | shows all                   | limit (integer)<br/><br/> offset (integer) |                                                                     |                      | result enclosed in []      |
| POST   | /state         | Add a new state             |                                            | name (string)                                                       | admin token          | posted city enclosed by [] |
| DELETE | /state/:id     | Deletes state of id         |                                            |                                                                     | admin                |
| PUT    | /state/:id     | Edit state_id specified     |                                            | name (string)                                                       | admin                | edited city enclosed by [] |
| GET    | /crop_type     |                             | limit (integer)<br/><br/> offset (integer) |                                                                     |                      |
| POST   | /crop_type     |                             |                                            | crop_type_name<br/><br/>crop_class ("fruit", "vegetable", "grains") | admin                | result enclosed by []      |
| DELETE | /crop_type/:id | Deletes crop_types          | crop_type_id                               |                                                                     | admin                |
| PATCH  | /crop_type/:id | Edit crop_type_id specified |                                            | crop_type_name (string) <br/><br/> crop_class(valid string)         | admin                | result enclosed by []      |

### Vendor

| Action | Endpoint           | Use case                | Query Parameters                 | Post Object Format                                                                                                                                                           | Special Token Needed           | Return                               |
| ------ | ------------------ | ----------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------ |
| PATCH  | /vendor/me         | Profile Edit            |                                  | type(string)<br/><br/>name(string)<br/><br/>state_id(valid int)<br/><br/>city_id(valid int)<br/><br/>pin_code(int)<br/><br/>address(string)<br/><br/>profile_picture(string) | vendor_token                   | full object of vendor enclosed by [] |
| GET    | /vendor/me         | Shows self profile      |                                  |                                                                                                                                                                              | vendor token                   | full object of vendor enclosed by [] |
| GET    | /vendor/:vendor_id | Shows a specific vendor |                                  |                                                                                                                                                                              | admin_token                    | full object of vendor enclosed by [] |
| GET    | /vendor/           | Show all vendors        | limit(int)<br/><br/> offset(int) |                                                                                                                                                                              | admin_token(temp not required) | full object of vendor enclosed by [] |
| DELETE | /vendor/me         | Delete account          |                                  |                                                                                                                                                                              | vendor_token                   |

### User

| Action | Endpoint       | Use case              | Query Parameters                 | Post Object Format                                                                                                                                     | Special Token Needed           | Result                             |
| ------ | -------------- | --------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ---------------------------------- |
| PATCH  | /user/me       | Profile Edit          |                                  | name(string)<br/><br/>state_id(valid int)<br/><br/>city_id(valid int)<br/><br/>pin_code(int)<br/><br/>address(string)<br/><br/>profile_picture(string) | user_token                     | full object of user enclosed by [] |
| GET    | /user/me       | Shows self profile    |                                  |                                                                                                                                                        | user token                     | full object of user enclosed by [] |
| GET    | /user/:user_id | Shows a specific user |                                  |                                                                                                                                                        | admin_token                    | full object of user enclosed by [] |
| GET    | /user/         | Show all users        | limit(int)<br/><br/> offset(int) |                                                                                                                                                        | admin_token(temp not required) | full object of user enclosed by [] |
| DELETE | /user/me       | Delete account        |                                  |                                                                                                                                                        | user_token                     |

### Crop

| Action | Endpoint  | Use case               | Query Parameters                                                                           | Post Object Format | Special Token Needed | Result                |
| ------ | --------- | ---------------------- | ------------------------------------------------------------------------------------------ | ------------------ | -------------------- | --------------------- |
| GET    | /crop     | To fetch all the crops | limit (integer)<br/><br/> offset (integer)                                                 |                    |                      | Object enclosed in [] |
| GET    | /crop/:id |                        | city_id<br/><br/> state_id<br/><br/> crop_class<br/><br/> crop_type_id<br/><br/> vendor_id |                    |                      | Object enclosed in [] |

### Vendor/Crop

| Action | Endpoint              | Use case                      | Query Parameters | Post Object Format                                                                                                         | Special Token Needed | Result                       |
| ------ | --------------------- | ----------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------- |
| GET    | /vendor/crop          | Fetch all crops of the vendor |                  |                                                                                                                            | vendor               | object enclosed by []        |
| GET    | /vendor/crop/:id      |                               |                  |                                                                                                                            | vendor               | object enclosed by []        |
| DELETE | /vendor/crop/:id      | single delete                 |                  |                                                                                                                            | vendor               |
| DELETE | /vendor/crop?id=1,2,3 | multiple delete               | id               |                                                                                                                            | vendor               |
| POST   | /vendor/crop          | Add a new crop                |                  | qty<br/><br/>crop_name<br/><br/>crop_type_id<br/><br/>packed_date<br/><br/>exp_date<br/><br/>description<br/><br/>         | vendor               | posted object enclosed by [] |
| PATCH  | /vendor/crop/:id      |                               |                  | changeInQty<br/><br/>crop_name<br/><br/>crop_type_id<br/><br/>packed_date<br/><br/>exp_date<br/><br/>description<br/><br/> | vendor               | posted object enclosed by [] |

| Action                               | Endpoint                                 | Use case                                                     | Query Parameters                                                                          | Post Object Format                                                                                                                                                             | special token needed |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| **END POINTS BELOW ARE NOT WORKING** |
| **crop**                             |
| GET                                  | /crop                                    | Shows all crops unless vendor_id specified                   | vendor_id (integer) limit (integer)<br/><br/> offset (integer)                            |
| POST                                 | /crop                                    | Adds a crop                                                  |                                                                                           | vendor_id (integer)<br/><br/> qty (decimal)<br/><br/> crop_name (string)<br/><br/> crop_type_id (integer from crop table)<br/><br/> packed_date (string 'YYYY-MM-DD HH:MM:SS') |
| GET                                  | /crop/:crop_id                           | Shows a specific crop                                        |
| DELETE                               | /crop                                    | Deletes all crop unless crop_id or vendor_id is specified    | !vendor_id (integer)<br/><br/> !crop_id (integer)                                         |
| **user cart**                        |
| GET                                  | /user/me/cart                            | Shows the cart of a user unless product id specified         | product_id (comma seprated integer)<br/><br/> limit (integers)<br/><br/> offset (integer) |
| POST                                 | /user/me/cart                            | Adds an item to the cart                                     |                                                                                           | crop_id (interger)<br/><br/> qty (decimal)                                                                                                                                     |
| DELETE                               | /user/me/cart                            | Empty the user cart unless product_id parameter is specified | product_id (comma seprated integers)                                                      |
| **order**                            |
| GET                                  | /order                                   | GET all orders unless user_id is specified                   | user_id (integer)<br/><br/>limit (integer)<br/><br/> offset (integer)                     |
| POST                                 | /order                                   | Place an order                                               |                                                                                           | user_id (integer)<br/><br/> delivery_address (string)<br/><br/> price (decimal)<br/><br/> product_id (array of integers)                                                       |
| GET                                  | /order/:order_id                         |
| DELETE                               | /order/:order_id                         | Cancel order                                                 |
| **notification**                     | NOT SET                                  |
| GET                                  | /notification                            | Shows all notification sent                                  |
| POST                                 | /notification                            | NOT SET                                                      |
| **complaint**                        |
| GET                                  | /complaint                               | Get all the complaints unless user_id is specified           | user_id (integer)<br/><br/> limit (integer)<br/><br/> offset (integer)                    |
| POST                                 | /complaint                               | Register a new complaint                                     |                                                                                           | order_id (integer)<br/><br/> type (string)<br/><br/> proof_id (array of integers)                                                                                              |
| GET                                  | /complaint/:complaint_id                 | Shows full complaint details                                 |
| GET                                  | /complaint/:complaint_id/proof           | Shows the complaint proofs                                   | limit (integer)<br/><br/> offset (integer)                                                |
| POST                                 | /complaint/:complaint_id/proof           | Registering a proof                                          |                                                                                           | type ('image'<br/><br/> 'pdf')<br/><br/> resource_url (string url)                                                                                                             |
| GET                                  | /complaint/:complaint_id/proof/:proof_id |
| **admin**                            | PROTECTED URL                            |
| GET                                  | /admin                                   | Get all admins                                               |                                                                                           |
| POST                                 | /admin/ban/user/:user_id                 | Bans a user                                                  |
| POST                                 | /admin/ban/vendor/:vendor_id             | Bans a vendor                                                |
| **misc**                             | NOT SET                                  |
| POST                                 | /upload                                  | Upload any image or file                                     |
