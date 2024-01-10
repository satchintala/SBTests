Feature: First Step - User Login (Phone Number and Country Code) Input

    Background: Get Anonymous Token
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation

    Scenario Outline: Input Phone Number and Country Code
        When Send login input API request with '<countryCode>', '<prefix>'
        Then Receive user login status '<message>'

        Examples:
            | countryCode | prefix | message        |
            | GB          | 44     | new_user       |
            | PT          | 351    | new_user       |
            | GB          | 444    | invalid_number |



