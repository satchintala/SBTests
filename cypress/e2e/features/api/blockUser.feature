Feature: Block a Verified User

    Background: Create a verfied user
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation
        When Send login input API request with 'GB', '44'
        Given Set verification code input mutation
        When Send verification code API request with 'GB', '44', '833335'
        Given Set the block user API mutation

    @sanity
    Scenario: Block the verified user
        When Send the block user API request with 'GB', '44'
        Then User is blocked

    Scenario: Login using a blocked user
        Given Set login input mutation
        When Send login input API request with 'GB', '44'
        Then Receive blocked user login status

