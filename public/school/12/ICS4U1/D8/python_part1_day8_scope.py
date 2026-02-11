#----------------------------------------------------------------------------------------
# PYTHON PART 1: DAY 8 - SCOPE
# ICS3U: MR. PALLADINI
#----------------------------------------------------------------------------------------

print("-" * 80)
print(f"PYTHON PART 1: DAY 8 - SCOPE")
print("-" * 80)

#----------------------------------------------------------------------------------------
# EXAMPLE 1a: LOCAL VARIABLES
# VARIABLES CREATED INSIDE OF A FUNCTION ARE LOCAL VARIABLES
# THEIR SCOPE IS LOCAL TO THAT FUNCTION AND CAN'T BE DIRECTLY ACCESSED FROM THE OUTSIDE
# teacherName IS LOCAL TO THE printInfo() FUNCTION
# COMMENT OUT THE LINE THAT CAUSES AN ERROR TO MOVE ON TO THE NEXT EXAMPLE
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 1a: LOCAL VARIABLES")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def printInfo():
    teacherName = "Mr. Palladini"
    print(f"Teacher Name: {teacherName}")

# MAIN PROGRAM
printInfo()
#print(f"My teacher is: {teacherName}") # ERROR BECAUSE PYTHON CAN'T FIND teacherName

#----------------------------------------------------------------------------------------
# EXAMPLE 1b: LOCAL VARIABLES
# TO ACCESS A LOCAL VARIABLE IT SHOULD BE RETURNED AND CAUGHT/STORED IN A VARIABLE
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 1b: LOCAL VARIABLES")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def getTeacherName():
    teacherName = "Mr. Palladini"
    print(f"Teacher Name: {teacherName}")
    return teacherName # A VALUE IS BEING RETURNED

# MAIN PROGRAM
myTeacher = getTeacherName() # THE RETURNED VALUE IS BEING CAUGHT/STORED IN A VARIABLE
print(f"\nMy teacher is: {myTeacher}")

#----------------------------------------------------------------------------------------
# QUESTION 1: ACCOUNT CREATOR
# 1) IDENTIFY THE 2 LOCAL VARIABLES IN THE EXAMPLE BELOW
#    LOCAL VARIABLE 1: accountName
#    LOCAL VARIABLE 2: length
# 2) EXAMINE THE FIRST 2 LINES OF THE MAIN PROGRAM AND FIX THE FIRST LINE
# 3) UNCOMMENT THE LAST LINE OF THE MAIN PROGRAM, RUN IT, EXPLAIN WHY IT CAUSES AN ERROR
#    EXPLANATION: length is a local variable inside getAccountName() and cannot be accessed from outside the function
# 4) COMMENT OUT THE LAST LINE AGAIN TO MOVE ON
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"QUESTION 1: ACCOUNT CREATOR")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def getAccountName():
  accountName = input("Please choose and enter an account name: ")
  length = len(accountName)
  
  if length >= 4:
    return accountName
  else:
    print("Your account name is too short. Please try again.\n")
    getAccountName()

# MAIN PROGRAM
name = getAccountName() # FIX THIS LINE
print(f"You have chosen {name} as an account name.")
#print(f"The length of {name} is {length}.") # UNCOMMENT AND EXPLAIN THE ERROR

#----------------------------------------------------------------------------------------
# EXAMPLE 2: GLOBAL VARIABLES
# ALL VARIABLES CREATED OUTSIDE OF A FUNCTION ARE GLOBAL VARIABLES
# THEIR SCOPE IS GLOBAL TO THE ENTIRE PROGRAM
# GLOBAL VARIABLES CAN BE READ/ACCESSED BY ANY FUNCTION
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 2: GLOBAL VARIABLES")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def menuPrinter():
    print(f"1. {item1:<10} $2.99")
    print(f"2. {item2:<10} $1.49")

# GLOBAL VARIABLES    
item1 = "Coffee"
item2 = "Tea"

# MAIN PROGRAM
menuPrinter()

#----------------------------------------------------------------------------------------
# QUESTION 2: GLOBAL VARIABLES
# 1) ADD THE MISSING CODE FROM GLOBAL VARIABLES
# 2) ADD THE MISSING CODE FROM THE MAIN PROGRAM
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"QUESTION 2: GLOBAL VARIABLES")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def calculateTotal(price):
  return round(price * tax, 2)

# GLOBAL VARIABLES 
tax = 1.13

# MAIN PROGRAM
userPrice = float(input("Enter an item's price to calculate the total with tax: "))
total = calculateTotal(userPrice)
print(f"The total is ${total:.2f}.")

#----------------------------------------------------------------------------------------
# EXAMPLE 3a: VARIABLE SHADOWING: ASSIGNING FIRST
# stringVar IS DECLARED AND ASSIGNED A VALUE INSIDE & OUTSIDE OF THE FUNCTION printVar()
# THE FIRST TIME printVar( ) ENCOUNTERS stringVar IT'S PERFORMING AN ASSIGNMENT OPERATION,
# SO IT'S JUST GOING TO CREATE A LOCAL VARIABLE OF ITS OWN CALLED stringVar
# IT IS NOT GOING TO REASSIGN A VALUE TO THE GLOBAL stringVar
# THIS MEANS THE GLOBAL stringVar IS BEING SHADOWED BY THE LOCAL stringVar
# AVOID DOING THIS TO AVOID ERRORS OR CONFUSING CODE BY USING DIFFERENT VARIABLE NAMES
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 3a: VARIABLE SHADOWING: ASSIGNING FIRST")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def printVarAssigning():
    stringVar = "Local stringVar" # ASSIGNING
    print(stringVar)

# GLOBAL VARIABLES
stringVar = "Global stringVar"

# MAIN PROGRAM
printVarAssigning()
print(stringVar)
stringVar = "Cupcake"
print(stringVar)
printVarAssigning()

#----------------------------------------------------------------------------------------
# EXAMPLE 3b: VARIABLE SHADOWING: READING FIRST
# stringVar IS DECLARED AND ASSIGNED A VALUE INSIDE & OUTSIDE OF THE FUNCTION printVar()
# THE FIRST TIME printVar() ENCOUNTERS stringVar IT'S ONLY READING ITS VALUE,
# SO IT ASSOCIATES stringVar WITH THE GLOBAL ONE INSTEAD OF CREATING A LOCAL stringVar()
# THE FUNCTION THEN TRIES TO REASSIGN THE GLOBAL stringVar BUT THIS CAUSES AN ERROR
# COMMENT THIS CODE OUT TO MOVE ON
#----------------------------------------------------------------------------------------

#print("\n" + "-" * 80)
#print(f"EXAMPLE 3b: VARIABLE SHADOWING: READING FIRST")
#print("-" * 80 + "\n")

# FUNCTION DEFINITION
#def printVar():
#    print(stringVar) # READING FIRST ASSOCIATES THIS stringVar WITH THE GLOBAL ONE
#    stringVar = "Reassigning global stringVar" # ERROR REASSIGNING THE GLOBAL stringVar
#    print(stringVar)

# GLOBAL VARIABLES
#stringVar = "Global stringVar"

# MAIN PROGRAM
#printVar()
#print(stringVar)

#----------------------------------------------------------------------------------------
# EXAMPLE 3c: VARIABLE SHADOWING: THE GLOBAL KEYWORD
# TO REASSIGN THE VALUE OF A GLOBAL VARIABLE THEN THE global KEYWORD NEEDS TO BE USED
# AT THE BEGINNING OF A FUNCTION LIST THE GLOBAL VARIABLES(S) YOU WANT TO MODIFY
# PRECEED EACH VARIABLE WITH THE GLOBAL KEYWORD
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 3c: VARIABLE SHADOWING: THE GLOBAL KEYWORD")
print("-" * 80 + "\n")

# FUNCTION DEFINITION
def printVar():
    global stringVar
    print(stringVar)
    stringVar = "Reassigning global stringVar" # REASSIGNING THE GLOBAL stringVar WORKS
    print(stringVar)

# GLOBAL VARIABLES
stringVar = "Global stringVar"

# MAIN PROGRAM
printVar()
print(stringVar)
