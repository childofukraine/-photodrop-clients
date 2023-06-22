# -photodrop-clients
## API endpoints:
#
### [POST] sign-in/send-otp - using for sign-in users
### body: JSON
```json
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
}
```
- After making request you will gain one time password (OTP) via phone number (you should use it for verification endpoint).
#
### [POST] sign-in/verify-otp
#### body: JSON
```json
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
	"otp": "380980", // required - only numbers in string
}
```
- After login you will gain access token, user information in response.body and refresh token in cookies. You should store access token in client side app in headers["authorization"].
#
### [POST] /upload-selfie
#### body: multipart-form
```json
{
  "files": "file.jpg", // required at least 1 file
}
```
#### headers: ["authorization"]: access_token
- uploads selfie to s3 + adds records in tables and return user info with selfie
#
### [GET] /get-all
#### body: none
#### headers: ["authorization"]: access_token
- returns to user information of all of his albums + photos
#
### [GET] /album/${albumId}
#### body: none
#### headers: ["authorization"]: access_token
- returns to user information of one album by album id
#
### [PUT] /name
#### body: JSON
```json
{
	"fullName": "Bob Tommy", 
}
```
#### headers: ["authorization"]: access_token
- updates user full name and return updated user info with selfie
#
### [GET] /me
#### body: none
#### headers: ["authorization"]: access_token
- you will gain user information in response.body
#
### [POST] /album/create-payment/${albumId}
#### body: none
#### headers: ["authorization"]: access_token
- creates payment link for album
- after successful payment auto redirection to confirm endpoint ("${HOST_URL}/pay/album/confirm-payment/${albumId}") for storing payment data
#