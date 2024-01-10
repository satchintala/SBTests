
@sanity
Feature: SB API - Anonymous Token

    Background: Set Get API Token Query
        Given Set the anonymous token API query

    Scenario Outline: Get Valid Anonymous API Token
        When Send the anonymous token request with applicationKey '<applicationKey>'
        Then Receive anonymous token

        Examples:
            | applicationKey     |
            | o4vo64fqgq_ios     |
            | djib8ao2qj_android |
            | o4vo64fqgq_iost    |






