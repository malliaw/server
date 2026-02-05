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
print(f"Hello, {givenName} {familyName}!")
print() # JUST PRINT AN EMPTY LINE BY NOT GIVING THIS print() FUNCTION AN ARGUMENT

# CALCULATION SECTION 1
givenLength = len(givenName)
familyLength = len(familyName)
fullLength = len(givenName + familyName)
totalValue = fullLength * 0.25

# OUTPUT SECTION 2
print(f"Given name length: {givenLength} {'$' * givenLength}")
print(f"Family name length: {familyLength} {'$' * familyLength}")
print(f"Full name length: {fullLength} {'$' * fullLength}")
print(f"Total value: ${totalValue:.2f}")

#-------------------------------------------------------------------------------
# QUESTION 2: STUDENT SCHEDULES
# CREATE A PROGRRAM THAT OUTPUTS THE CLASS SCHEDULE OF 2 STUDNETS
#-------------------------------------------------------------------------------

# DECLARATION & INITIALIZATION SECTION
student1 = "Alice Johnson"
student2 = "Bob Smith"
class1 = "Mathematics"
class2 = "English"
class3 = "Science"
class4 = "History"
class5 = "Physical Education"
class6 = "Art"

# OUTPUT SECTION 1
print(f"\n{student1}'s Schedule:")
print(f"Period 1: {class1}\nPeriod 2: {class2}\nPeriod 3: {class3}")
print() # JUST PRINT AN EMPTY LINE BY NOT GIVING THIS print() FUNCTION AN ARGUMENT
print(f"{student2}'s Schedule:")
print(f"Period 4: {class4}\nPeriod 5: {class5}\nPeriod 6: {class6}")

#-------------------------------------------------------------------------------
# QUESTION 3: WALMART RECEIPT
# CREATE OUTPUT THAT LOOKS LIKE A WALMART RECEIPT
#-------------------------------------------------------------------------------

# DECLARATION & INITIALIZATION SECTION
store_name = "WALMART"
store_location = "123 Main St, Anytown, ON"
item1, price1 = "Bananas", 2.99
item2, price2 = "Bread", 3.49
item3, price3 = "Milk", 4.29
subtotal = price1 + price2 + price3
tax = subtotal * 0.13
total = subtotal + tax

# OUTPUT SECTION 1
print(f"\n{'*' * 30}")
print(f"{store_name:^30}")
print(f"{store_location:^30}")
print(f"{'*' * 30}")
print(f"{item1:<20} ${price1:>6.2f}")
print(f"{item2:<20} ${price2:>6.2f}")
print(f"{item3:<20} ${price3:>6.2f}")
print(f"{'_' * 30}")
print(f"{'Subtotal':<20} ${subtotal:>6.2f}")
print(f"{'Tax (13%)':<20} ${tax:>6.2f}")
print(f"{'Total':<20} ${total:>6.2f}")
print(f"{'*' * 30}")