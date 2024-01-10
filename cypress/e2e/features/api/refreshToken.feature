Feature: New Login Token Using Refresh Token

    Background: Generate a new Login Token
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation
        When Send login input API request with 'GB', '44'
        Given Set verification code input mutation
        When Send verification code API request with 'GB', '44', '833335'
        Given Set refresh token API query

    @sanity
    Scenario: Validate generating a new Login Token using Refresh Token
        When Send the refresh token API request
        Then Receive new login token

    Scenario: Validate error message when invalid Refresh Token is supplied
        When Send the invalid refresh token API request
        Then Receive refresh token error

