@sanity
Feature: Final Step - Signup Complete

    Background: Get Anonymous Token, Verification Code
        Given Set the anonymous token API query
        When Send the anonymous token request with applicationKey "o4vo64fqgq_ios"
        Given Set login input mutation

    Scenario Outline: Validate Signup
        When Send login input API request with '<countryCode>', '<prefix>'
        Given Set verification code input mutation
        When Send verification code API request with '<countryCode>', '<prefix>', '<vCode>'
        Given Set signup mutation
        When Send signup mutation API request with '<countryCode>', '<prefix>', '<gender>', '<dob>'
        Then Receive user signup status

        Examples:
            | countryCode | prefix | vCode  | gender | dob                       |
            | GB          | 44     | 833335 | male   | 2000-06-18T14:59:11+00:00 |
            | PT          | 351    | 833335 | female | 1990-05-18T14:59:10+00:00 |