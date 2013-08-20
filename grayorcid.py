#!/opt/local/bin/python3.1

import sys
from bs4 import BeautifulSoup
import urllib.request
import re

def main():
    orcid = sys.argv[1]

    if not is_orcid(orcid):
        print("That doesn't look like an ORCID.")
        quit()

    this_name = get_name(orcid)
    if this_name == "": 
        print("No one has that ORCID")
        quit()

    orcid_decimal = int(orcid.replace('-', '')[0:-1])

    mask = int('0b10000000000000000000000000000000000000000000000000', 2)

    print(mask);

    counter = 0
    hits = []

    for i in range(0, 50):
        new_string = format(orcid_decimal ^ mask, "015d")
        new_orcid = '-'.join([new_string[x:x+4] for x in range(0,16,4)])+check_digit(new_string)
        print(new_orcid)
                    
        if new_orcid < '0000-0003-5000-0001' and new_orcid > '0000-0001-5000-0007':
            pass
            #print(format(orcid_decimal, "050b"), '^', format(mask, "050b"), '=', new_string, check_digit(new_string), new_orcid, '*')
            #print(format(orcid_decimal, "050b"))
            #print(format(mask, "050b"))
            #print(format(orcid_decimal ^ mask, "050b"))
            #print('')
            #name = get_name(new_orcid)
            #counter += 1
            #if name != '':
            #    hits.append([new_orcid, name])
        else:
            #print(format(orcid_decimal, "050b"), '^', format(mask, "050b"), '=', new_string, check_digit(new_string), new_orcid)
            pass
        mask = mask >> 1
    print("Tried " + str(counter) + " 'adjacent' and legal ORCIDs")
    #print(orcid, get_name(orcid) + " matches: ")
    #if len(hits) == 0:
    #    print("no one")
    #else:
    #    for i in hits:
    #        print(i[0], i[1])

def is_orcid(possible):
    # 15 digits + 1 digit or X -- nope
    # sixteen = re.compile("^[0-9]{15}[0-9Xx]$")
    # optionally include hyphens
    hyphenated = re.compile("^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9Xx]$")
    if hyphenated.match(possible):
        possible = possible.replace('-', '')
    else:
        return 0
    # check digit OK
    if check_digit(possible[0:-1]) == possible[-1]:
        pass
    else:
        return 0
    # is in range of distributed ORCIDs
    if possible < '0000000350000001' and possible > '0000000150000007':
        return 1
    else:
        return 0

def check_digit(base):
    total = 0
    for i in range(0, len(str(base))):
        digit = str(base)[i]
        total = (total + int(digit)) * 2
    remainder = total % 11
    result = (12 - remainder) % 11
    if result == 10:
        return 'X'
    else:
        return str(result)

def get_name(orcid):
    page = urllib.request.urlopen('http://orcid.org/' + orcid)
    html = page.read()
    soup = BeautifulSoup(html)
    return soup.find('h2', "full-name").string.strip()

main()
