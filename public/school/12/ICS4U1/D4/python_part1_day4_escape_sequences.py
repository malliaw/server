#----------------------------------------------------------------------------------------
# PYTHON PART 1: DAY 4 - ESCAPE SEQUENCES / CHARACTERS
# ICS3U/ICS4U REVIEW: MR. PALLADINI
#----------------------------------------------------------------------------------------

print("-" * 88)
print(f"PYTHON PART 1: DAY 4 - ESCAPE SEQUENCES / CHARACTERS")
print("-" * 88)

#----------------------------------------------------------------------------------------
# QUESTION 1: FILE PATH
# PRINT THE FILE PATH THAT WAS SHOWN ON BRIGHTSPACE
#----------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print("QUESTION 1: FILE PATH")
print("-" * 88 + "\n")

import os
print(os.path.abspath(__file__))
print("C:\\Files\\Valorant")

#----------------------------------------------------------------------------------------
# QUESTION 2: ICE CREAM FLAVOURS
# PRINT THE ICE CREAM FLAVOURS THAT WERE SHOWN ON BRIGHTSPACE
#----------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print("QUESTION 2: ICE CREAM FLAVOURS")
print("-" * 88 + "\n")

flavours = {
    "Basic": {"chocolate", "neopolitan"},
    "Special": {"bubblegum", "tiger tail"},
    "Premium": {"mint chocolate", "butterscotch"},
    "In-House": {"tiramisu", "red velvet"}
}

for type in flavours:
    flavourlist = []
    for flavour in flavours[type]:
        flavourlist.append(flavour.capitalize())
    print(f"{type} Flavours: " + "\\".join(flavourlist))

#----------------------------------------------------------------------------------------
# QUESTION 3: MOVIE QUOTES
# PRINT THE MOVIE QUOTES THAT WERE SHOWN ON BRIGHTSPACE
# NOTICE THAT THERE ARE QUOTATION MARKS IN THE OUTPUT, SO PRINT THOSE TOO
# YOUR ATTEMPT AT THIS QUESTION WILL PROBABLY RESULT IN SYNTAX ERRORS
#----------------------------------------------------------------------------------------

print("\n" + "-" * 88)
print("QUESTION 3: MOVIE QUOTES")
print("-" * 88 + "\n")

print("\"I always tell the truth. Even when I lie.\"") # <-- YOUR ANSWER HERE
print()
print("\"Stay Here. I'll be back.\"") # <-- YOUR ANSWER HERE

#----------------------------------------------------------------------------------------
# NOW GO BACK TO BRIGHTSPACE AND SCROLL TO THE BOTTOM FOR THE SOLUTIONS PYTHON FILE
#----------------------------------------------------------------------------------------