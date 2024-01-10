Feature: Second Step - Verification Code

    Background: Get Anonymous Token, Login Input
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation

    Scenario Outline: Validate verification code
        When Send login input API request with '<countryCode>', '<prefix>'
        Given Set verification code input mutation
        When Send verification code API request with '<countryCode>', '<prefix>', '<vCode>'
        Then Receive verification code status '<success>'

        Examples:
            | countryCode | prefix | vCode  | success |
            | GB          | 44     | 833335 | true    |
            | GB          | 44     | 833336 | false   |


