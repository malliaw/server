#----------------------------------------------------------------------------------------
# PYTHON PART 1: DAY 3 - FORMATTED STRINGS / F-STRINGS
# ICS3U: MR. PALLADINI
#----------------------------------------------------------------------------------------

print("-" * 80)
print(f"PYTHON PART 1: DAY 3 - FORMATTED STRINGS / F-STRINGS")
print("-" * 80)

#----------------------------------------------------------------------------------------
# EXAMPLE 1a: COMPARING PRINTING METHODS: THE PROBLEM WITH MULTIPLE ARGUMENTS
# USE AN f BEFORE THE OPENING QUOTATION MARKS OF A STRING
# INSERT VARIABLES/EXPRESSIONS/FUNCTIONS IN THE STRING BY USING CURLY BRACES { }
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 1a: COMPARING PRINTING METHODS")
print("-" * 80 + "\n")

teacherName = "Mr. Palladini"

# USING A FORMATTED STRING (F-STRING)
print("Formatted String:")
print(f"My teacher's name is {teacherName}.")
print()

# USING MULTIPLE ARGUMENTS
# CHECK THE OUTPUT YOU WILL NOTICE A SPACE IS AUTOMATICALLY ADDED AFTER teacherName
print("Multiple Arguments:")
print("My teacher's name is", teacherName, ".")
print()

# USING CONCATENATION
print("Concatenation:")
print("My teacher's name is " + teacherName + ".")

#----------------------------------------------------------------------------------------
# EXAMPLE 1b: COMPARING PRINTING METHODS: THE PROBLEM WITH CONCATENATION
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 1b: COMPARING PRINTING METHODS")
print("-" * 80 + "\n")

userAge = 19

# USING A FORMATTED STRING (F-STRING)
print("Formatted String:")
print(f"You are {userAge} years old.")
print()

# USING MULTIPLE ARGUMENTS
print("Multiple Arguments:")
print("You are", userAge, "years old.")
print()

# USING CONCATENATION
# THIS IS GOING TO GIVE YOU AN ERROR!
# WE ARE TRYING TO CONCATENATE STRINGS WITH A NON-STRING VARIABLE (INT), BUT YOU CAN'T
# RUN THE PROGRAM, NOTE THE TypeError, THEN COMMENT OUT THE CODE 2 LINES BELOW
print("Concatenation:")
print("You are " + userAge + " years old.") # COMMENT THIS LINE OUT

# TO SOLVE THIS YOU WOULD HAVE TO CONVERT userAge TO A STRING USING THE str() FUNCTION
print("You are " + str(userAge) + " years old.")

#----------------------------------------------------------------------------------------
# EXAMPLE 2: REWRITING AS AN F-STRING
# I WROTE THE OUTPUT USING MULTIPLE ARGUMENTS AND CONCATENATION
# YOU REWRITE THE OUTPUT USING AN F-STRING
# REMEMBER YOU CAN PUT MATHEMATICAL EXPRESSIONS INSIDE THE CURLY BRACES EX: {5+5}
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 2: REWRITING AS AN F-STRING")
print("-" * 80 + "\n")

firstName = "Michael"
lastName = "Jordan"
number = 23
average = 30.1

# USING A FORMATTED STRING (F-STRING)
print("Formatted String:")
print(f"")
print()

# USING MULTIPLE ARGUMENTS
print("Multiple Arguments:")
print(firstName, lastName, "#", number, ",", average, "ppg. Joined NBA:", 1984 - 1963)
print()

# USING CONCATENATION
print("Concatenation:")
print(firstName + " " + lastName + " #" + str(number) + ", " + str(average) +
      " ppg. Joined NBA: " + str(1984 - 1963))

#----------------------------------------------------------------------------------------
# EXAMPLE 3: FORMAT SPECIFIERS: ALIGNMENT AND FIELD WIDTH (BOX)
# F-STRINGS ALLOW US TO FORMAT AND ALIGN CONTENT NICELY USING FORMAT SPECIFIERS
# USE A COLON : TO ACCESS SPECIFIERS
# USE < ^ > TO SPECIFY ALIGNMENT/JUSTIFICATION
# USE A NUMBER TO SPECIFY THE FIELD WIDTH (BOX)
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 3: FORMAT SPECIFIERS: ALIGNMENT AND FIELD WIDTH (BOX)")
print("-" * 80 + "\n")

playerName = "Shane Van Boening"

# RESERVES A FIELD WIDTH (BOX) OF 40 CHARACTERS ALIGNS THE VARIABLE TO THE LEFT
print(f"Player: {playerName:<40}")

# RESERVES A FIELD WIDTH (BOX) OF 40 CHARACTERS ALIGNS THE VARIABLE IN THE CENTER
print(f"Player: {playerName:^40}")

# RESERVES A FIELD WIDTH (BOX) OF 40 CHARACTERS ALIGNS THE VARIABLE TO THE RIGHT
print(f"Player: {playerName:>40}")

#----------------------------------------------------------------------------------------
# EXAMPLE 4: OVERFILLING THE FIELD WIDTH (BOX)
# OVERFILLING THE FIELD WIDTH WILL CAUSE OUTPUT TO WOBBLE
# NOTE HOW BAND 3 WOBBLES IN COMPARISON TO THE OTHERS
# OVERFILLING THE FIELD WIDTH DOES NOT CHOP OFF THE CONTENT
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 4: OVERFILLING THE FIELD WIDTH (BOX)")
print("-" * 80 + "\n")

rockBand1 = "Van Halen"
country1 = "U.S.A."
ytSubs1 = 904000

rockBand2 = "AC/DC"
country2 = "Australia"
ytSubs2 = 11400000

rockBand3 = "Guns N' Roses"
country3 = "U.S.A."
ytSubs3 = 12900000

rockBand4 = "Rush"
country4 = "Canada"
ytSubs4 = 758000

print(f"|Band 1: {rockBand1:<10} From: {country1:<9} YouTube Subscribers: {ytSubs1:<6}|")
print(f"|Band 2: {rockBand2:<10} From: {country2:<9} YouTube Subscribers: {ytSubs2:<6}|")
print(f"|Band 3: {rockBand3:<10} From: {country3:<9} YouTube Subscribers: {ytSubs3:<6}|")
print(f"|Band 4: {rockBand4:<10} From: {country4:<9} YouTube Subscribers: {ytSubs4:<6}|")

#----------------------------------------------------------------------------------------
# EXAMPLE 5: FORMAT SPECIFIERS WITH BOOLEANS
# WHEN ADDING FORMAT SPECIFIERS TO BOOLEANS IT WILL CONVERT TO AN INTEGER
# USE THE str() FUNCTION TO EXPLICITLY CONVERT A BOOLEAN TO A STRING
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 5: FORMAT SPECIFIERS WITH BOOLEANS")
print("-" * 80 + "\n")

championName1 = "Irelia"
championIsAlive1 = True

championName2 = "Xin Zhao"
championIsAlive2 = False

championName3 = "Lux"
championIsAlive3 = True

championName4 = "Twitch"
championIsAlive4 = False

championName5 = "Soraka"
championIsAlive5 = True

# FIRST 2 DON'T LINE UP AT THE END BECAUSE "TRUE" and "FALSE" ARE DIFFERNET LENGTHS
print(f"[ {championName1:<10} Alive: {championIsAlive1} ]")
print(f"[ {championName2:<10} Alive: {championIsAlive2} ]")

# USING FORMAT SPECIFIERS WILL MAKE THEM LINE UP, BUT CONVERTS THEM TO INTEGERS
print(f"[ {championName3:<10} Alive: {championIsAlive3:<5} ]")
print(f"[ {championName4:<10} Alive: {championIsAlive4:<5} ]")

# USE str() TO EXPLICITLY CONVERT A BOOLEAN TO A STRING
print(f"[ {championName5:<10} Alive: {str(championIsAlive5):<5} ]")

#----------------------------------------------------------------------------------------
# EXAMPLE 6: BLENDING AND ALIGNING MULTIPLE VARIABLES OF DIFFERENT DATA TYPES
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 6: BLENDING AND ALIGNING MULTIPLE VARIABLES OF DIFFERENT DATA TYPES")
print("-" * 80 + "\n")

item1 = "Pokemon Cards"
price1 = 4.99
quantity1 = 5
isOnSale1 = False

item2 = "Magic Cards"
price2 = 10.00
quantity2 = 32
isOnSale2 = True

print(f"|Item: {item1:^20} ${price1:>8.2f} Qty: {quantity1:<4}Sale: {str(isOnSale1):<5}|")
print(f"|Item: {item2:^20} ${price2:>8.2f} Qty: {quantity2:<4}Sale: {str(isOnSale2):<5}|")

#----------------------------------------------------------------------------------------
# EXAMPLE 7: ROUNDING TO A DECIMAL PLACE
# USE .#f TO ROUND A FLOAT TO A CERTAIN NUMBER OF SIGNIFICANT DIGITS
#----------------------------------------------------------------------------------------

print("\n" + "-" * 80)
print(f"EXAMPLE 7: ROUNDING TO A DECIMAL PLACE")
print("-" * 80 + "\n")

product = "Lug Bolt"
weight = 14.78494

print(f"Product: {product:<12} Weight: {weight:<10.1f} grams")
print(f"Product: {product:<12} Weight: {weight:<10.2f} grams")
print(f"Product: {product:<12} Weight: {weight:<10.3f} grams")
print(f"Product: {product:<12} Weight: {weight:<10.4f} grams")

#----------------------------------------------------------------------------------------
# ADVANTAGES OF USING FORMATTED STRINGS / F-STRINGS
#----------------------------------------------------------------------------------------
# ALLOWS US TO BLEND VARIABLES OF DIFFERENT DATA TYPES TOGETHER EASILY
# ALLOWS US TO EASILY ADJUSTING SPACING BETWEEN VARIABLES AND CONTENT
# ALLOWS US TO ROUND FLOATS
# AVOIDS HAVING TO CONSTANTLY OPEN AND CLOSE QUOTATION MARKS
# AVOIDS HAVING TO USE int(), float(), str() FUNCTIONS
# PROVIDES BETTER READABILITY

# YOU CAN RESEARCH OTHER FORMAT SPECIFIERS TOO

# USE F-STRINGS TO DO A BETTER JOB OF FORMATTING THE QUESTIONS FROM DAY 2 - STRINGS
