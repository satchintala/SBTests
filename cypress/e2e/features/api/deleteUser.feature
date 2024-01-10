Feature: Delete a Normal User (Bee)

    Background: Signup a user
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation
        When Send login input API request with 'PT', '351'
        Given Set verification code input mutation
        When Send verification code API request with 'PT', '351', '833335'
        Given Set signup mutation
        When Send signup mutation API request with 'PT', '351', 'female', '1985-09-21T14:59:11+00:00'

    @sanity
    Scenario: Delete the User
        Given Set the delete user API mutation
        When Send the delete user API request
        Then User is deleted