# Automatic Teller Machine (ATM) TDD Kata

## Specifications

You need to implement a simple ATM machine that allows th user to withdraw money. 

The ATM stores its balance in a json file.

The ATM has an initial balance of 10000 in bills of 50.

The user has a limit per withdrawal given by an external service.

### Exceptions

- When the amount can not be dispensed, the ATM should return an error message.
- When the amount is greater than the balance or the limit, the ATM should return the maximum amount that can be withdrawn.

