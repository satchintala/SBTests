@sanity
Feature: SB API - Country Configurations

    Background: Get Anonymous Token
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"

    Scenario Outline: Validate Country Configuration
        Given Set the country configuration API query
        When Send the country configuration API request with '<countryCode>'
        Then Receive country configuration

        Examples:
            | countryCode |
            | GB          |
            | AF          |

    Scenario Outline: Missing Authorizatoin Header
        Given Set the country configuration API query
        When Send the country configuration API request with invalid '<token>'
        Then Receive token error '<message>'

        Examples:
            | token | message                                 |
            | test  | Invalid Authorization                   |
            |       | Format is Authorization: Bearer [token] |