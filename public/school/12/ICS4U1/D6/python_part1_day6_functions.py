#---------------------------------------------------------------------------------------
# PYTHON PART 1: DAY 6 - FUNCTIONS
# ICS3U/ICS4U REVIEW: MR. PALLADINI
#---------------------------------------------------------------------------------------

#---------------------------------------------------------------------------------------
# QUESTION 1: LINE PRINTER
# DEFINE A FUNCTION TO PRINT 10 EMPTY LINES
# CALL THE FUNCTION IN THE APPROPRIATE PLACE
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 1: LINE PRINTER")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def print_lines(amt:int=10):
    print("\n" * amt)

# MAIN PROGRAM
print("This is before the function is called.")
print_lines()
print("This is after the function is called.")

#---------------------------------------------------------------------------------------
# QUESTION 2: NAME PRINTER
# DEFINE A FUNCTION WITH 1 PARAMETER FOR A NAME (STRING)
# THE FUNCTION SHOULD THEN PRINT THE NAME SURROUNDED BY A BOX
# PROMPT THE USER FOR THEIR NAME
# CALL THE FUNCTION
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 2: NAME PRINTER")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def print_name_box(name):
    border = "+" + "-" * (len(name) + 2) + "+"
    print(border)
    print(f"| {name} |")
    print(border)

# MAIN PROGRAM
user_name = input("Enter your name: ")
print_name_box(user_name)

#---------------------------------------------------------------------------------------
# QUESTION 3: HYPOTENUSE CALCULATOR
# DEFINE A FUNCTION WITH 2 PARAMETERS FOR SIDES A AND B OF A RIGHT TRIANGLE
# THE FUNCTION SHOULD CALCULATE AND RETURN THE HYPOTENUSE
# PROMPT THE USER FOR THE LENGTH OF SIDE A AND B
# CALL THE FUNCTION AND STORE/CATCH THE RETURN VALUE IN A VARIABLE
# OUTPUT THE ANSWER IN A SENTENCE ROUNDED TO 2 DECIMAL PLACES
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 3: HYPOTENUSE CALCULATOR")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def calculate_hypotenuse(a, b):
    return (a**2 + b**2)**0.5

# MAIN PROGRAM
side_a = float(input("Enter the length of side A: "))
side_b = float(input("Enter the length of side B: "))
hypotenuse = calculate_hypotenuse(side_a, side_b)
print(f"The hypotenuse is {hypotenuse:.2f}")

#---------------------------------------------------------------------------------------
# QUESTION 4a: CELSIUS TO FAHRENHEIT CALCULATOR
# DEFINE A FUNCTION WITH 1 PARAMETER FOR A TEMPERATURE IN CELSIUS
# THE FUNCTION SHOULD CALCULATE AND RETURN THE TEMPERATURE IN FAHRENHEIT
# PROMPT THE USER TO ENTER A TEMPERATURE IN CELSIUS
# CALL THE FUNCTION AND STORE/CATCH THE RETURN VALUE IN A VARIABLE
# OUTPUT THE ANSWER IN A SENTENCE ROUNDED TO 2 DECIMAL PLACES
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 4a: CELSIUS TO FAHRENHEIT CALCULATOR")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

# MAIN PROGRAM
temp_celsius = float(input("Enter temperature in Celsius: "))
temp_fahrenheit = celsius_to_fahrenheit(temp_celsius)
print(f"{temp_celsius:.2f}°C is {temp_fahrenheit:.2f}°F")

#---------------------------------------------------------------------------------------
# QUESTION 4b: FAHRENHEIT TO CELSIUS CALCULATOR
# DO THE OPPOSITE OF 4a
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 4b: FAHRENHEIT TO CELSIUS CALCULATOR")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def fahrenheit_to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5/9

# MAIN PROGRAM
temp_fahrenheit = float(input("Enter temperature in Fahrenheit: "))
temp_celsius = fahrenheit_to_celsius(temp_fahrenheit)
print(f"{temp_fahrenheit:.2f}°F is {temp_celsius:.2f}°C")

#---------------------------------------------------------------------------------------
# QUESTION 5: TOTAL PRICE CALCULATOR
# DEFINE A FUNCTION WITH 2 PARAMETERS FOR THE PRICE AND QUANTITY OF A PRODUCT
# THE FUNCTION SHOULD CALCULATE AND RETURN THE TOTAL INCLUDING TAX (13%)
# PROMPT THE USER TO ENTER THE PRICE AND QUANTITY OF A PRODUCT
# CALL THE FUNCTION AND STORE/CATCH THE RETURN VALUE IN A VARIABLE
# OUTPUT THE ANSWER IN A SENTENCE ROUNDED TO 2 DECIMAL PLACES
#---------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print(f"QUESTION 5: TOTAL PRICE CALCULATOR")
print("-" * 88 + "\n")

# FUNCTION DEFINITION
def calculate_total(price, quantity):
    subtotal = price * quantity
    return subtotal * 1.13

# MAIN PROGRAM
price = float(input("Enter the price of the product: $"))
quantity = int(input("Enter the quantity: "))
total = calculate_total(price, quantity)
print(f"The total price including tax is ${total:.2f}")
