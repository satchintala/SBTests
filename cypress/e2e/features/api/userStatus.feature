@sanity
Feature: User Status

    Background: Get Anonymous Token
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"

    Scenario Outline: Validate User Status
        Given Set user status query
        When Send user status request with client platform '<clientPlatform>' and client app version '<clientAppVersion>'
        Then Receive user status '<typeName>'

        Examples:
            | clientPlatform | clientAppVersion | typeName     |
            | ios            | 3.48.0           | Unauthorized |
            | ios            | 0.0.0            | AppUpdate    |
            | android        | 0.0.0            | AppUpdate    |
            | android        | 3.61.0           | Unauthorized |

    Scenario: Invalid Authorization
        Given Set user status query
        When Send user status request invalid token
        Then Receive Authorization error