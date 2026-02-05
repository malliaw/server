import random
import math
#---------------------------------------------------------------------------------------
# QUESTION 1: MIN MAX RANDOM INTEGER
# CREATE A PROGRAM THAT PROMPTS THE USER FOR A MINIMUM AND MAXIMUM INTEGER
# GENERATE AND OUTPUT A RANDOM INTEGER FROM THE MINIMUM TO THE MAXIMUM (BOTH INCLUSIVE)
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 1: MIN MAX RANDOM INTEGER")
print("-" * 88 + "\n")

minValue = int(input("Enter a minimum integer: "))
maxValue = int(input("Enter a maximum integer: "))
randomInteger = random.randint(minValue, maxValue)
print(f"Random integer between {minValue} and {maxValue}: {randomInteger}")


#---------------------------------------------------------------------------------------
# QUESTION 2: CIRCLE AREA AND CIRCUMFERENCE CALCULATOR
# CREATE A PROGRAM THAT PROMPTS THE USER FOR A RADIUS OF A CIRCLE
# CALCULATE THE AREA OF THE CIRCLE AND STORE IT IN A VARIABLE
# CALCULATE THE CIRCUMFERENCE OF THE CIRCLE AND STORE IT IN A VARIABLE
# ROUND THE AREA UP TO THE CLOSEST INTEGER
# ROUND THE CIRCUMFERENCE DOWN TO THE CLOSEST INTEGER
# OUTPUT A SENTENCE INDICATING WHAT THE CALCULATED AREA IS
# OUTPUT A SENTENCE INDICATING WHAT THE CALCULATED CIRCUMFERENCE IS
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 2: CIRCLE AREA AND CIRCUMFERENCE CALCULATOR")
print("-" * 88 + "\n")

radius = float(input("Enter the radius of the circle: "))
area = math.pi * math.pow(radius, 2)
circumference = 2 * math.pi * radius
area = math.ceil(area)
circumference = math.floor(circumference)
print(f"The area of the circle is {area}.")
print(f"The circumference of the circle is {circumference}.")


#---------------------------------------------------------------------------------------
# QUESTION 3: RANDOM GREETING PICKER
# CREATE A LIST THAT CONTAINS GREETINGS FROM 5 DIFFERENT LANGUAGES
# 2 LANGUAGES SHOULD HAVE A 10% CHANCE OF SELECTION
# 1 LANGUAGE SHOULD HAVE A 20% CHANCE OF SELECTION
# 2 LANGUAGES SHOULD HAVE A 30% CHANCE OF SELECTION
# HINT: AN ELEMENT OF A LIST CAN APPEAR MORE THAN ONCE
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 3: RANDOM GREETING PICKER")
print("-" * 88 + "\n")

greetingList = ["Hello", "Bonjour", "Bonjour", "Hola", "Hola", "Hola", "Ciao", "Ciao", "Ciao", "Konnichiwa"]
randomGreeting = random.choice(greetingList)
print(f"Random greeting: {randomGreeting}")


#---------------------------------------------------------------------------------------
# QUESTION 4: RANDOM PASSWORD GENERATOR
# CREATE A PROGRAM THAT GENERATES A RANDOM PASSWORD WITH THE FOLLOWING FORMAT:
# 1: A RANDOM SPECIAL CHARACTER (e.g., #^&@)
# 2: A RANDOM NUMBER FROM 0 - 9 (INCLUSIVE)
# 3: A RANDOM LETTER FROM LOWERCASE a - z
# 4: A RANDOM NUMBER FROM 75 - 100 (INCLUSIVE)
# 5: A RANDOM LETTER FROM UPPERCASE A - Z
# 6: A RANDOM SPECIAL CHARACTER (e.g., #^&@)
# HINT: USE CONCATENATION, THE str() FUNCTION, AND random FUNCTIONS
# EXAMPLE: #9k88T$
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 4: RANDOM PASSWORD GENERATOR")
print("-" * 88 + "\n")

specialChar1 = random.choice("#^&@")
number1 = random.randint(0, 9)
lowercase = random.choice("abcdefghijklmnopqrstuvwxyz")
number2 = random.randint(75, 100)
uppercase = random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
specialChar2 = random.choice("#^&@")
password = specialChar1 + str(number1) + lowercase + str(number2) + uppercase + specialChar2
print(f"Random password: {password}")


#---------------------------------------------------------------------------------------
# QUESTION 5: FIGHTER STATUS DISPLAY
# CREATE THE DISPLAY SHOWN ON BRIGHTSPACE SHOWING THE STATUS OF A VIDEO GAME FIGHTER
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 5: FIGHTER STATUS DISPLAY")
print("-" * 88 + "\n")

# ANSI color codes
RED = '\033[91m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
RESET = '\033[0m'

name = "King Crusher"
className = "Warrior"
life = random.randint(80, 100)
mana = random.randint(50, 100)
power = random.randint(50, 100)

# Create status bars (out of 10 segments)
lifeBar = int(life / 10)
manaBar = int(mana / 10)
powerBar = int(power / 10)

# Build colored status bars
lifeDisplay = f"[{RED}{'|' * lifeBar}{RESET}{' ' * (10 - lifeBar)}]"
manaDisplay = f"[{CYAN}{'*' * manaBar}{RESET}{' ' * (10 - manaBar)}]"
powerDisplay = f"[{YELLOW}{'█' * powerBar}{RESET}{' ' * (10 - powerBar)}]"

print(f"QUESTION 5: FIGHTER STATUS DISPLAY")
print(f"{'-' * 44}")
print(f" Name: {name}")
print(f"Class: {className}")
print(f" Life: {lifeDisplay}")
print(f" Mana: {manaDisplay}")
print(f"Power: {powerDisplay}")
