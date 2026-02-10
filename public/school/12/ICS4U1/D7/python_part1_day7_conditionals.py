#-------------------------------------------------------------------------------
# PYTHON PART 1: DAY 7 - CONDITIONALS
# ICS3U: MR. PALLADINI
#-------------------------------------------------------------------------------
import math
import random

#-------------------------------------------------------------------------------
# QUESTION 1: NUMBER GUESSER
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 1: NUMBER GUESSER")
print("-" * 80 + "\n")

secret_number = random.randint(1, 10)
guess = int(input("Guess a number between 1 and 10: "))

if guess == secret_number:
    print("Correct! You guessed it!")
elif guess < secret_number:
    print(f"Too low! The number was {secret_number}")
else:
    print(f"Too high! The number was {secret_number}")

#-------------------------------------------------------------------------------
# QUESTION 2: INTEGER COMPARER
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 2: INTEGER COMPARER")
print("-" * 80 + "\n")

num1 = int(input("Enter first integer: "))
num2 = int(input("Enter second integer: "))

if num1 > num2:
    print(f"{num1} is greater than {num2}")
elif num1 < num2:
    print(f"{num1} is less than {num2}")
else:
    print(f"{num1} is equal to {num2}")

#-------------------------------------------------------------------------------
# QUESTION 3: VOWEL CHECKER
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 3: VOWEL CHECKER")
print("-" * 80 + "\n")

letter = input("Enter a single character: ").lower()

if letter in 'aeiou':
    print(f"'{letter}' is a vowel")
else:
    print(f"'{letter}' is not a vowel")

#-------------------------------------------------------------------------------
# QUESTION 4: WEIGHT CLASS CHECKER
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 4: WEIGHT CLASS CHECKER")
print("-" * 80 + "\n")

weight = float(input("Enter weight in kg: "))

if weight < 60:
    print("Lightweight")
elif weight <= 80:
    print("Middleweight")
else:
    print("Heavyweight")

#-------------------------------------------------------------------------------
# QUESTION 5: WAGE CALCULATOR
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 5: WAGE CALCULATOR")
print("-" * 80 + "\n")

hours = float(input("Enter hours worked: "))
rate = float(input("Enter hourly rate: $"))

if hours <= 40:
    wage = hours * rate
else:
    wage = (40 * rate) + ((hours - 40) * rate * 1.5)

print(f"Total wage: ${wage:.2f}")

#-------------------------------------------------------------------------------
# QUESTION 6: PROMO CODE
#-------------------------------------------------------------------------------

print("-" * 80)
print(f"QUESTION 6: PROMO CODE")
print("-" * 80 + "\n")

total = float(input("Enter purchase total: $"))
promo_code = input("Enter promo code (or press Enter to skip): ").upper()

if promo_code == "SAVE10":
    discount = total * 0.10
    final_total = total - discount
    print(f"Discount applied: ${discount:.2f}")
    print(f"Final total: ${final_total:.2f}")
elif promo_code == "SAVE20":
    discount = total * 0.20
    final_total = total - discount
    print(f"Discount applied: ${discount:.2f}")
    print(f"Final total: ${final_total:.2f}")
else:
    print(f"No discount applied. Total: ${total:.2f}")
