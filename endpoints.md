# Endpoints

### Using Query String

```shell
/path/or/url/of/endpoint/?paramter1=valueOfparameter&&paramter2=valueOfparameter&&paramter3=valueOfparameter
```

> - paramter specified with '!' are compulsary parameter
> - if this parameter is not specified then admin action is needed
> - other parameters are optional

### Login / Signup

| Action | Endpoint    | Use case                        | Query Parameters                        | Post Object Format                                                                  | Special Token Needed | Return          |
| ------ | ----------- | ------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- | :------------------: | --------------- |
| POST   | /login      | Login admin                     |                                         | type(admin; vendor; user)<br/>username<br/>password                                 |                      | admin in header |
| GET    | /otp_login  | vendor; user; for getting OTP   | type("vendor";"user")<br/>contact(int)  |                                                                                     |                      |
| POST   | /otp_login  | vendor; user for confirming OTP |                                         | contact(int)<br/> otp(int)<br/> type("vendor";"user")<br/> device_fcm_token(string) |                      | token in header |
| GET    | /otp_signup |                                 | contact(int)<br/> type("vendor";"user") |                                                                                     |                      |
| POST   | /otp_signup |                                 |                                         | contact(int)<br/> otp(int)<br/> type("vendor","user")<br/> device_fcm_token(string) |                      | token in header |

### City

| Action | Endpoint  | Use case               | Query Parameters                      | Post Object Format                    | Special Token Needed | Return                     |
| ------ | --------- | ---------------------- | ------------------------------------- | ------------------------------------- | :------------------: | -------------------------- |
| GET    | /city     | Show all cities        | limit (integer)<br/> offset (integer) |                                       |                      | result enclosed in []      |
| POST   | /city     | Add a new city         |                                       | name (string)<br/>state_id(valid int) |        admin         | posted city enclosed by [] |
| DELETE | /city/:id | Deletes city           |                                       |                                       |        admin         |
| PUT    | /city/:id | Edit city_id specified |                                       | name (string)<br/>state_id            |        admin         | edited city enclosed by [] |

### State

| Action | Endpoint   | Use case                | Query Parameters                      | Post Object Format | Special Token Needed | Return                     |
| ------ | ---------- | ----------------------- | ------------------------------------- | ------------------ | :------------------: | -------------------------- |
| GET    | /state     | shows all               | limit (integer)<br/> offset (integer) |                    |                      | result enclosed in []      |
| POST   | /state     | Add a new state         |                                       | name (string)      |        admin         | posted city enclosed by [] |
| DELETE | /state/:id | Deletes state of id     |                                       |                    |        admin         |
| PUT    | /state/:id | Edit state_id specified |                                       | name (string)      |        admin         | edited city enclosed by [] |

### Crop Type

| Action | Endpoint       | Use case                    | Query Parameters                      | Post Object Format                                               | Special Token Needed | Return                |
| ------ | -------------- | --------------------------- | ------------------------------------- | ---------------------------------------------------------------- | :------------------: | --------------------- |
| GET    | /crop_type     |                             | limit (integer)<br/> offset (integer) |                                                                  |                      |
| POST   | /crop_type     |                             |                                       | crop_type_name<br/>crop_class ("FRUITS", "VEGETABLES", "GRAINS") |        admin         | result enclosed by [] |
| DELETE | /crop_type/:id | Deletes crop_types          | crop_type_id                          |                                                                  |        admin         |
| PATCH  | /crop_type/:id | Edit crop_type_id specified |                                       | crop_type_name (string) <br/> crop_class(valid string)           |        admin         | result enclosed by [] |

### Vendor

| Action | Endpoint           | Use case                | Query Parameters            | Post Object Format                                                                                                                             |   Special Token Needed   | Return                               |
| ------ | ------------------ | ----------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------: | ------------------------------------ |
| PATCH  | /vendor/me         | Profile Edit            |                             | type(string)<br/>name(string)<br/>state_id(valid int)<br/>city_id(valid int)<br/>pin_code(int)<br/>address(string)<br/>profile_picture(string) |          vendor          | full object of vendor enclosed by [] |
| GET    | /vendor/me         | Shows self profile      |                             |                                                                                                                                                |          vendor          | full object of vendor enclosed by [] |
| GET    | /vendor/:vendor_id | Shows a specific vendor |                             |                                                                                                                                                |          admin           | full object of vendor enclosed by [] |
| GET    | /vendor/           | Show all vendors        | limit(int)<br/> offset(int) |                                                                                                                                                | admin(temp not required) | full object of vendor enclosed by [] |
| DELETE | /vendor/me         | Delete account          |                             |                                                                                                                                                |          vendor          |

### User

| Action | Endpoint       | Use case              | Query Parameters            | Post Object Format                                                                                                            |   Special Token Needed   | Result                             |
| ------ | -------------- | --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | :----------------------: | ---------------------------------- |
| PATCH  | /user/me       | Profile Edit          |                             | name(string)<br/>state_id(valid int)<br/>city_id(valid int)<br/>pin_code(int)<br/>address(string)<br/>profile_picture(string) |           user           | full object of user enclosed by [] |
| GET    | /user/me       | Shows self profile    |                             |                                                                                                                               |           user           | full object of user enclosed by [] |
| GET    | /user/:user_id | Shows a specific user |                             |                                                                                                                               |          admin           | full object of user enclosed by [] |
| GET    | /user/         | Show all users        | limit(int)<br/> offset(int) |                                                                                                                               | admin(temp not required) | full object of user enclosed by [] |
| DELETE | /user/me       | Delete account        |                             |                                                                                                                               |           user           |

### Crop

| Action | Endpoint  | Use case               | Query Parameters                                                       | Post Object Format | Special Token Needed | Result                |
| ------ | --------- | ---------------------- | ---------------------------------------------------------------------- | ------------------ | :------------------: | --------------------- |
| GET    | /crop     | To fetch all the crops | limit (integer)<br/> offset (integer)                                  |                    |                      | Object enclosed in [] |
| GET    | /crop/:id |                        | city_id<br/> state_id<br/> crop_class<br/> crop_type_id<br/> vendor_id |                    |                      | Object enclosed in [] |

### Vendor / Crop

| Action | Endpoint              | Use case                      | Query Parameters | Post Object Format                                                                                                 | Special Token Needed | Result                       |
| ------ | --------------------- | ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ | :------------------: | ---------------------------- |
| GET    | /vendor/crop          | Fetch all crops of the vendor |                  |                                                                                                                    |        vendor        | object enclosed by []        |
| GET    | /vendor/crop/:id      |                               |                  |                                                                                                                    |        vendor        | object enclosed by []        |
| DELETE | /vendor/crop/:id      | single delete                 |                  |                                                                                                                    |        vendor        |
| DELETE | /vendor/crop?id=1,2,3 | multiple delete               | id               |                                                                                                                    |        vendor        |
| POST   | /vendor/crop          | Add a new crop                |                  | crop_qty<br/>crop_name<br/>crop_type_id<br/>crop_price<br/>packed_timestamp<br/>exp_timestamp<br/>description<br/> |        vendor        | posted object enclosed by [] |
| PATCH  | /vendor/crop/:id      |                               |                  | changeInQty<br/>crop_name<br/>crop_type_id<br/>packed_timestamp<br/>exp_timestamp<br/>description<br/>             |        vendor        | posted object enclosed by [] |

### User / Cart

| Action | Endpoint            | Use case                         | Query Parameters | Post Object Format        | Special Token Needed | Result                       |
| ------ | ------------------- | -------------------------------- | ---------------- | ------------------------- | :------------------: | ---------------------------- |
| GET    | /user/cart          | Fetch all cart items of the user |                  |                           |         user         | object enclosed by []        |
| GET    | /user/cart/:id      |                                  |                  |                           |         user         | object enclosed by []        |
| DELETE | /user/cart/:id      | single delete                    |                  |                           |         user         |
| DELETE | /user/cart?id=1,2,3 | multiple delete                  | id               |                           |         user         |
| POST   | /user/cart          | Add a new cart item              |                  | item_qty<br/>crop_id<br/> |         user         | posted object enclosed by [] |
| PATCH  | /user/cart/:id      |                                  |                  | changeInQty               |         user         | posted object enclosed by [] |

### Order

| Action | Endpoint       | Use case            | Query Parameters | Post Object Format                                                                                  |   Special Token Needed   | Result |
| ------ | -------------- | ------------------- | ---------------- | --------------------------------------------------------------------------------------------------- | :----------------------: | ------ |
| GET    | /order/me      | To view self orders |                  |                                                                                                     | vendor <br/>or<br/> user |
| GET    | /order/:id     | View specific order |                  |                                                                                                     |                          |
| GET    | /order/        | View all Orders     |                  |                                                                                                     |                          |
| POST   | /order/cancel  | Cancel an order     |                  | order_id                                                                                            | vendor <br/>or<br/> user |
| POST   | /order/confirm | Confirm an order    |                  | order_id                                                                                            |          vendor          |
| POST   | /order/request | Place a order       |                  | delivery_address <br/> order:[{crop_id, item_qty}, {crop_id, item_qty}] with order from same vendor |           user           |

### Misc

| Action | Endpoint      | Use case         | Query Parameters | Post Object Format                                     |    Special Token Needed    | Result                |
| ------ | ------------- | ---------------- | ---------------- | ------------------------------------------------------ | :------------------------: | --------------------- |
| POST   | /upload/image | Upload any image |                  | form-data key : image_to_upload, value: file_to_upload | admin<br/>vendor<br/>token | check result_formats/ |

| Action                               | Endpoint                                 | Use case                                           | Query Parameters                                             | Post Object Format                                                      | special token needed |
| ------------------------------------ | ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------- |
| **END POINTS BELOW ARE NOT WORKING** |
| **notification**                     | NOT SET                                  |
| GET                                  | /notification                            | Shows all notification sent                        |
| POST                                 | /notification                            | NOT SET                                            |
| **complaint**                        |
| GET                                  | /complaint                               | Get all the complaints unless user_id is specified | user_id (integer)<br/> limit (integer)<br/> offset (integer) |
| POST                                 | /complaint                               | Register a new complaint                           |                                                              | order_id (integer)<br/> type (string)<br/> proof_id (array of integers) |
| GET                                  | /complaint/:complaint_id                 | Shows full complaint details                       |
| GET                                  | /complaint/:complaint_id/proof           | Shows the complaint proofs                         | limit (integer)<br/> offset (integer)                        |
| POST                                 | /complaint/:complaint_id/proof           | Registering a proof                                |                                                              | type ('image'<br/> 'pdf')<br/> resource_url (string url)                |
| GET                                  | /complaint/:complaint_id/proof/:proof_id |
| **admin**                            | PROTECTED URL                            |
| GET                                  | /admin                                   | Get all admins                                     |                                                              |
| POST                                 | /admin/ban/user/:user_id                 | Bans a user                                        |
| POST                                 | /admin/ban/vendor/:vendor_id             | Bans a vendor                                      |
