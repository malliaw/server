#-------------------------------------------------------------------------------
# PYTHON PART 1: DAY 2 - STRINGS
# ICS3U: MR. PALLADINI
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
# QUESTION 1: NAME AND MONEY
# CREATE A PROGRRAM THAT PROMPTS THE USER FOR THEIR GIVEN AND FAMILY NAME
# OUTPUT A GREETING TO THE USER THAT INCLUDS THEIR NAME
# OUTPUT HOW MANY CHARACTERS ARE IN THEIR GIVEN NAME AND DISPLAY A $ FOR EACH
# OUTPUT HOW MANY CHARACTERS ARE IN THEIR FAMILY NAME AND DISPLAY A $ FOR EACH
# OUTPUT HOW MANY CHARACTERS ARE IN THEIR FULL NAME AND DISPLAY A $ FOR EACH
# CALCULATE THE TOTAL OF THEIR NAME IF A QUARTER IS GIVEN FOR EACH CHARACTER
# OUTPUT THE TOTAL TO THE USER
#-------------------------------------------------------------------------------

# INPUT SECTION 1
givenName = input("Enter your given name: ")
familyName = input("Enter your family name: ")

# OUTPUT SECTION 1
print("Hello " + givenName + " " + familyName + "!")
print() # JUST PRINT AN EMPTY LINE BY NOT GIVING THIS print() FUNCTION AN ARGUMENT

# CALCULATION SECTION 1
givenLength = len(givenName)
familyLength = len(familyName)
fullLength = len(givenName + familyName)
totalValue = fullLength * 0.25

# OUTPUT SECTION 2
print("Given name has " + str(givenLength) + " characters: " + "$" * givenLength)
print("Family name has " + str(familyLength) + " characters: " + "$" * familyLength)
print("Full name has " + str(fullLength) + " characters: " + "$" * fullLength)
print("Total value: $" + str(totalValue))

#-------------------------------------------------------------------------------
# QUESTION 2: STUDENT SCHEDULES
# CREATE A PROGRRAM THAT OUTPUTS THE CLASS SCHEDULE OF 2 STUDNETS
#-------------------------------------------------------------------------------

# DECLARATION & INITIALIZATION SECTION
student1 = "John Smith"
student2 = "Jane Doe"
class1 = "Math"
class2 = "English"
class3 = "Science"
class4 = "History"
class5 = "PE"
class6 = "Art"

# OUTPUT SECTION 1
print()
print("Student Schedules:")
print() # JUST PRINT AN EMPTY LINE BY NOT GIVING THIS print() FUNCTION AN ARGUMENT
print(student1 + ": " + class1 + ", " + class2 + ", " + class3)
print(student2 + ": " + class4 + ", " + class5 + ", " + class6)

#-------------------------------------------------------------------------------
# QUESTION 3: WALMART RECEIPT
# CREATE OUTPUT THAT LOOKS LIKE A WALMART RECEIPT
#-------------------------------------------------------------------------------

# DECLARATION & INITIALIZATION SECTION
storeName = "WALMART"
storeLocation = "123 Main St, City, State"
item1 = "Milk"
item2 = "Bread"
item3 = "Eggs"
price1 = 3.99
price2 = 2.49
price3 = 4.99
subtotal = price1 + price2 + price3
tax = subtotal * 0.13
total = subtotal + tax

# OUTPUT SECTION 1
print()
print("=" * 30)
print(storeName.center(30))
print(storeLocation.center(30))
print("=" * 30)
print(item1 + " " * (20 - len(item1)) + "$" + str(price1))
print(item2 + " " * (20 - len(item2)) + "$" + str(price2))
print(item3 + " " * (20 - len(item3)) + "$" + str(price3))
print("-" * 30)
print("Subtotal" + " " * 15 + "$" + str(round(subtotal, 2)))
print("Tax" + " " * 21 + "$" + str(round(tax, 2)))
print("Total" + " " * 19 + "$" + str(round(total, 2)))