# -photodrop-clients
## API endpoints:
#
### [POST] auth/sign-in/send-otp - using for sign-in users
### body: JSON
```json
{
	"phoneNumber": "992453199", // required - only numbers in string
	"countryCode": "380", // required - only numbers in string
}
```
- After making request you will gain one time password (OTP) via phone number (you should use it for verification endpoint).
#
### [POST] /auth/sign-in/verify-otp
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