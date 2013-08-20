#!/opt/local/bin/python3.1

import sys
from bs4 import BeautifulSoup
import urllib.request

def main():
    orcid = sys.argv[1]
    name = get_name(orcid)
    if name != '':
        print(name)

def get_name(orcid):
    page = urllib.request.urlopen('http://orcid.org/' + orcid)
    html = page.read()
    soup = BeautifulSoup(html)
    return soup.find('h2', "full-name").string.strip()

main()
